"""Feed business rules: timeline ranking, engagement, post composition."""

from __future__ import annotations

import math
import time
from datetime import UTC, datetime
from typing import Any

from sqlalchemy.orm import Session

from app.core.cache import cache_key, get_json, invalidate_pattern, set_json
from app.core.config import settings
from app.core.errors import ForbiddenError, NotFoundError, ValidationAppError
from app.core.pagination import Cursor, Page, PageParams
from app.models.paper import Paper
from app.models.social import FeedComment, FeedPost
from app.modules.feed.repository import FeedRepository
from app.schemas import FeedCommentOut, FeedPostOut, PostType


def _humanize(ts: datetime | None) -> str:
    """Frontend renders `timestamp` as free text ("Just now", "2h ago")."""
    if ts is None:
        return "Just now"
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=UTC)
    seconds = max(0, int((datetime.now(UTC) - ts).total_seconds()))
    if seconds < 60:
        return "Just now"
    if seconds < 3600:
        return f"{seconds // 60}m ago"
    if seconds < 86400:
        return f"{seconds // 3600}h ago"
    if seconds < 86400 * 30:
        return f"{seconds // 86400}d ago"
    return ts.date().isoformat()


class FeedService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repo = FeedRepository(db)

    # ── timeline ────────────────────────────────────────────────────────

    def feed(
        self, user_id: str, sort: str, page: PageParams, interests: list[str]
    ) -> Page[FeedPostOut]:
        key = cache_key("feed", user_id, sort, page.cursor.encode() if page.cursor else "root")
        cached = get_json(key, None)
        if cached is not None:
            return Page[FeedPostOut].model_validate(cached)

        window = max(400, page.limit * 10)
        if sort == "recommended":
            candidates = self.repo.window(window)
            ranked = self._rank_recommended(candidates, interests)
        else:
            ids = self.repo.timeline_ids(user_id, window)
            ranked = self.repo.posts_by_ids(ids)

        start = 0
        if page.cursor and page.cursor.i:
            ids_seen = [p.id for p in ranked]
            if page.cursor.i in ids_seen:
                start = ids_seen.index(page.cursor.i) + 1

        slice_ = ranked[start : start + page.limit + 1]
        has_more = len(slice_) > page.limit
        visible = slice_[: page.limit]

        out = self._hydrate(visible, user_id)
        next_cursor = None
        if has_more and visible:
            next_cursor = Cursor(k=0, i=visible[-1].id).encode()

        result: Page[FeedPostOut] = Page(items=out, nextCursor=next_cursor)
        # Cache alias-keyed so a hit round-trips through validation.
        set_json(key, result.model_dump(by_alias=True), settings.cache_ttl_feed)
        return result

    def _rank_recommended(self, posts: list[FeedPost], interests: list[str]) -> list[FeedPost]:
        if not posts:
            return []
        max_likes = max((p.like_count for p in posts), default=1) or 1
        interest_set = {i.lower() for i in interests}
        now = datetime.now(UTC)

        def score(p: FeedPost) -> float:
            engagement = p.like_count / max_likes
            created = p.created_at or now
            if created.tzinfo is None:
                created = created.replace(tzinfo=UTC)
            age_days = max(0.0, (now - created).total_seconds() / 86400.0)
            recency = 0.5 ** (age_days / 7.0)
            overlap = 0.0
            if interest_set:
                tags = {str(t).lower() for t in (p.tags or [])}
                if p.linked_paper:
                    if p.linked_paper.domain:
                        tags.add(p.linked_paper.domain.lower())
                    if p.linked_paper.tags:
                        tags.update(str(t).lower() for t in p.linked_paper.tags)
                    if p.linked_paper.title:
                        tags.update(p.linked_paper.title.lower().split())
                hits = sum(1 for i in interest_set if any(i in t or t in i for t in tags))
                overlap = min(1.0, hits / max(1, len(interest_set)))
            return 0.45 * engagement + 0.25 * recency + 0.30 * overlap

        return sorted(posts, key=score, reverse=True)

    def _hydrate(self, posts: list[FeedPost], viewer_id: str) -> list[FeedPostOut]:
        if not posts:
            return []
        ids = [p.id for p in posts]
        liked = self.repo.liked_ids(viewer_id, ids)
        comments = self.repo.comments_for(ids)
        papers = self.repo.papers_for(ids)

        out: list[FeedPostOut] = []
        for post in posts:
            model = FeedPostOut.model_validate(post, from_attributes=True)
            model.timestamp = _humanize(post.created_at)
            model.isLiked = post.id in liked
            model.comments = [
                FeedCommentOut(
                    id=c.id,
                    authorName=c.author_name,
                    authorInstitution=c.author_institution,
                    authorAvatar=c.author_avatar,
                    content=c.content,
                    timestamp=_humanize(c.created_at),
                    verified=c.author_verified,
                )
                for c in comments.get(post.id, [])
            ]
            linked = papers.get(post.id)
            if linked is not None:
                model.linkedPaper = PaperOutFrom(linked)
            out.append(model)
        return out

    def get_post(self, post_id: str, viewer_id: str) -> FeedPostOut:
        post = self.repo.get(post_id)
        if post is None:
            raise NotFoundError(f"Post '{post_id}' not found")
        return self._hydrate([post], viewer_id)[0]

    # ── writes ──────────────────────────────────────────────────────────

    def create_post(
        self,
        *,
        user_id: str,
        author: dict[str, Any],
        content: str,
        post_type: str,
        linked_paper_id: str | None,
    ) -> FeedPostOut:
        if not content.strip():
            raise ValidationAppError("Post content cannot be empty")

        paper: Paper | None = None
        if linked_paper_id:
            paper = self.db.get(Paper, linked_paper_id)
            if paper is None:
                raise NotFoundError(f"Paper '{linked_paper_id}' not found")

        post = FeedPost(
            author_id=user_id,
            content=content.strip(),
            post_type=post_type,
            linked_paper_id=linked_paper_id,
            tags=[post_type, "Research"],
            author_name=author.get("name", ""),
            author_title=author.get("title", ""),
            author_institution=author.get("institution", ""),
            author_avatar=author.get("avatar", ""),
            author_verified=bool(author.get("verified", False)),
        )
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        invalidate_pattern("ck:")
        return self.get_post(post.id, user_id)

    def toggle_like(self, user_id: str, post_id: str, want: bool) -> dict[str, Any]:
        if self.repo.get(post_id) is None:
            raise NotFoundError(f"Post '{post_id}' not found")
        changed = self.repo.add_like(user_id, post_id) if want else self.repo.remove_like(user_id, post_id)
        self.db.commit()
        invalidate_pattern("ck:")
        post = self.repo.get(post_id)
        assert post is not None
        return {"ok": True, "isLiked": want if changed or self.repo.is_liked(user_id, post_id) else False, "likes": post.like_count}

    def add_comment(self, user_id: str, author: dict[str, Any], post_id: str, content: str) -> FeedCommentOut:
        if not content.strip():
            raise ValidationAppError("Comment cannot be empty")
        post = self.repo.get(post_id)
        if post is None:
            raise NotFoundError(f"Post '{post_id}' not found")

        comment = FeedComment(
            post_id=post_id,
            author_id=user_id,
            content=content.strip(),
            author_name=author.get("name", ""),
            author_institution=author.get("institution", ""),
            author_avatar=author.get("avatar", ""),
            author_verified=bool(author.get("verified", False)),
        )
        self.repo.add_comment(comment)
        self.db.commit()
        self.db.refresh(comment)

        if post.author_id != user_id:
            self._notify(post, author.get("name", "A researcher"), content)
        invalidate_pattern("ck:")

        return FeedCommentOut(
            id=comment.id,
            authorName=comment.author_name,
            authorInstitution=comment.author_institution,
            authorAvatar=comment.author_avatar,
            content=comment.content,
            timestamp=_humanize(comment.created_at),
            verified=comment.author_verified,
        )

    def list_comments(self, post_id: str) -> list[FeedCommentOut]:
        if self.repo.get(post_id) is None:
            raise NotFoundError(f"Post '{post_id}' not found")
        grouped = self.repo.comments_for([post_id])
        return [
            FeedCommentOut(
                id=c.id,
                authorName=c.author_name,
                authorInstitution=c.author_institution,
                authorAvatar=c.author_avatar,
                content=c.content,
                timestamp=_humanize(c.created_at),
                verified=c.author_verified,
            )
            for c in grouped.get(post_id, [])
        ]

    def delete_comment(self, user_id: str, comment_id: str) -> None:
        row = self.repo.delete_comment(comment_id)
        if row is None:
            raise NotFoundError(f"Comment '{comment_id}' not found")
        if row.author_id != user_id:
            raise ForbiddenError("You can only delete your own comments")
        self.db.commit()
        invalidate_pattern("ck:")

    def _notify(self, post: FeedPost, actor: str, snippet: str) -> None:
        try:
            from app.modules.notifications.service import create_notification

            create_notification(
                self.db,
                post.author_id,
                "comment",
                "New comment on your update",
                f"{actor}: {snippet[:140]}",
                link=f"/posts/{post.id}",
                entity_id=post.id,
            )
        except Exception:  # noqa: BLE001 - notification failure must not fail the comment
            pass

    def _bust(self) -> None:
        invalidate_pattern("ck:")


from app.schemas import PaperOut as PaperOutSchema  # noqa: E402


def PaperOutFrom(paper: Paper) -> PaperOutSchema:  # noqa: N802 - local helper
    return PaperOutSchema.model_validate(paper, from_attributes=True)


__all__ = ["FeedService", "PostType", "math"]
