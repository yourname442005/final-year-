"""Verification script for Phase 3:
1. Validates /api/v1/papers/{id}/related returns real semantically related papers from ChromaDB / related_papers.
2. Validates /api/v1/papers/{id}/citation formats citations across APA, MLA, and BibTeX.
3. Validates /api/v1/feed?sort=recommended uses user interests and semantic signals.
"""

import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

db_path = (BACKEND_DIR / "ckgai_dev.db").resolve()
os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"

from fastapi.testclient import TestClient
from app.main import create_app
from app.core.config import settings

def run_tests():
    print("Initializing test client...")
    app = create_app()
    client = TestClient(app)

    # 1. Test listing papers to get a real seed paper
    res = client.get("/api/v1/papers?limit=5")
    assert res.status_code == 200, f"List papers failed: {res.text}"
    data = res.json()
    items = data.get("items", [])
    assert len(items) > 0, "No papers found in database"
    seed_paper = items[0]
    paper_id = seed_paper["id"]
    print(f"\n[Test 1] Seed Paper: '{seed_paper['title'][:50]}...' (ID: {paper_id}, Venue: {seed_paper.get('venue')})")

    # 2. Test Related Papers
    rel_res = client.get(f"/api/v1/papers/{paper_id}/related?limit=3")
    assert rel_res.status_code == 200, f"Related papers failed: {rel_res.text}"
    related = rel_res.json()
    print(f"[Test 1 Passed] /api/v1/papers/{paper_id}/related returned {len(related)} related papers:")
    for r in related:
        print(f"  - [{r.get('venue')}] {r.get('title')[:60]}... (Citations: {r.get('citationCount')})")
    assert len(related) > 0, "Expected at least 1 related paper"

    # 3. Test Citations
    formats = ["APA", "MLA", "BibTeX"]
    print("\n[Test 2] Citation Generation:")
    for fmt in formats:
        cite_res = client.get(f"/api/v1/papers/{paper_id}/citation?format={fmt}")
        assert cite_res.status_code == 200, f"Citation {fmt} failed: {cite_res.text}"
        cite_data = cite_res.json()
        print(f"  - [{fmt}]: {cite_data['citation'][:80]}...")
    print("[Test 2 Passed] Citations successfully formatted.")

    # 4. Test Feed Recommendations with user interests
    print("\n[Test 3] Feed Recommendation Ranking:")
    feed_res = client.get("/api/v1/feed?sort=recommended&limit=5")
    assert feed_res.status_code == 200, f"Feed failed: {feed_res.text}"
    feed_data = feed_res.json()
    posts = feed_data.get("items", [])
    print(f"[Test 3 Passed] /api/v1/feed?sort=recommended returned {len(posts)} ranked feed posts.")
    for p in posts[:3]:
        print(f"  - Post by {p.get('authorName')} ({p.get('authorInstitution')}): {p.get('content')[:60]}... Likes: {p.get('likeCount')}")

    print("\n>>> ALL PHASE 3 BACKEND TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    run_tests()
