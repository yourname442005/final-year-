'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, MessageSquare, ShieldCheck, Share2, Plus, ArrowRight } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';
import { PaperCard } from '../PaperCard';
import { Paper } from '@/lib/mock-data';

interface FeedViewProps {
  onOpenPaperDetail: (paper: Paper) => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
  onOpenNewPost: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  onOpenPaperDetail,
  onOpenCite,
  onOpenAddToCollection,
  onOpenNewPost
}) => {
  const { feedPosts, toggleLikePost, addCommentToPost, toggleFollowResearcher, researchers, user } = usePlatformStore();
  const [feedFilter, setFeedFilter] = useState<'Recency' | 'Recommended'>('Recency');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addCommentToPost(postId, commentInput);
    setCommentInput('');
    setActiveCommentPostId(null);
  };

  const sortedPosts = [...feedPosts].sort((a, b) => {
    if (feedFilter === 'Recommended') {
      return b.likes - a.likes;
    }
    return 0; // default recency
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Editorial Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 flex items-center justify-between flex-wrap gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757]">
            Research Updates & Preprints
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#141413] leading-tight">
            Scientific Field Journal Feed
          </h1>
          <p className="font-serif text-sm text-[#141413]/85 leading-relaxed">
            Follow verified researchers, discover newly posted preprints, and engage in methodology discussions across computational and physical sciences.
          </p>
        </div>

        <button
          onClick={onOpenNewPost}
          className="btn-clay py-3 px-6 text-sm font-sans flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Publish Update</span>
        </button>
      </div>

      {/* Feed Filter Bar */}
      <div className="flex items-center justify-between border-b border-[#cccbc8] pb-3">
        <div className="flex items-center gap-3">
          {(['Recency', 'Recommended'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFeedFilter(filter)}
              className={`font-sans text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                feedFilter === filter
                  ? 'bg-[#141413] text-[#faf9f5]'
                  : 'bg-[#faf9f5] text-[#87867f] border border-[#cccbc8] hover:border-[#141413]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <span className="font-sans text-xs text-[#87867f]">
          Showing {sortedPosts.length} updates
        </span>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {sortedPosts.map((post) => {
          const author = researchers.find((r) => r.id === post.authorId);
          const isFollowing = author ? author.isFollowed : false;

          return (
            <div
              key={post.id}
              className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-6 space-y-4 hover:border-[#141413] transition-all"
            >
              {/* Post Author Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-full object-cover border border-[#cccbc8]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif text-base font-medium text-[#141413]">
                        {post.authorName}
                      </h4>
                      {post.authorVerified && (
                        <span title="Verified Researcher">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-[#87867f]">
                      {post.authorTitle} • {post.authorInstitution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs bg-[#e3dacc] text-[#141413] px-2.5 py-1 rounded-full font-medium">
                    {post.postType}
                  </span>
                  <span className="font-sans text-xs text-[#87867f]">{post.timestamp}</span>

                  {author && post.authorId !== user.id && (
                    <button
                      onClick={() => toggleFollowResearcher(post.authorId)}
                      className={`btn-outlined-dark text-xs py-1 px-3 ml-2 ${
                        isFollowing ? 'bg-[#141413] text-[#faf9f5]' : ''
                      }`}
                    >
                      {isFollowing ? 'Following' : '+ Follow'}
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <p className="font-serif text-base text-[#141413] leading-relaxed">
                {post.content}
              </p>

              {/* Embedded Linked Paper Card */}
              {post.linkedPaper && (
                <div className="pt-2">
                  <span className="font-sans text-xs font-semibold text-[#87867f] uppercase tracking-wider block mb-2">
                    Linked Preprint Publication
                  </span>
                  <PaperCard
                    paper={post.linkedPaper}
                    onOpenDetail={onOpenPaperDetail}
                    onOpenCite={onOpenCite}
                    onOpenAddToCollection={onOpenAddToCollection}
                    showRelevanceSignal={false}
                  />
                </div>
              )}

              {/* Post Footer Controls */}
              <div className="pt-3 border-t border-[#cccbc8]/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 font-sans text-xs text-[#141413]">
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? 'text-[#d97757] font-semibold' : 'text-[#87867f] hover:text-[#141413]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#d97757]' : ''}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 text-[#87867f] hover:text-[#141413] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Post permalink copied to clipboard!');
                  }}
                  className="font-sans text-xs text-[#87867f] hover:text-[#141413] flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Update</span>
                </button>
              </div>

              {/* Comments Section */}
              {(post.comments.length > 0 || activeCommentPostId === post.id) && (
                <div className="bg-[#f0eee6] rounded-xl p-4 space-y-3 mt-3 border border-[#cccbc8]">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-1 pb-2 border-b border-[#cccbc8]/50 last:border-none">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-semibold text-[#141413] flex items-center gap-1">
                          {comment.authorName}
                          {comment.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                        </span>
                        <span className="font-sans text-[11px] text-[#87867f]">{comment.timestamp}</span>
                      </div>
                      <p className="font-serif text-xs text-[#141413]/90">{comment.content}</p>
                    </div>
                  ))}

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add a scientific comment..."
                      value={activeCommentPostId === post.id ? commentInput : ''}
                      onFocus={() => setActiveCommentPostId(post.id)}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                      className="flex-1 p-2 bg-[#faf9f5] border border-[#cccbc8] rounded-lg text-xs font-serif text-[#141413] focus:outline-none focus:border-[#d97757]"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="btn-clay text-xs py-2 px-3"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
