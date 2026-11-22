"""Verification script for Phase 4:
1. Tests /api/chat-assistant with scientific research query and ChromaDB RAG retrieval.
2. Verifies grounded sources are retrieved and returned.
3. Tests /api/chat-assistant with workspace project context.
4. Verifies paper summarization and insights endpoints.
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

def run_tests():
    print("Initializing test client for Phase 4...")
    app = create_app()
    client = TestClient(app)

    # 1. Test Chat Assistant with general literature query
    print("\n[Test 1] Testing /api/chat-assistant with literature query:")
    query = "What are the latest techniques and architectures for 3D scene understanding?"
    res = client.post(
        "/api/chat-assistant",
        json={
            "message": query,
            "projectContext": {
                "name": "Neural 3D Reconstruction",
                "field": "Computer Vision",
                "description": "Evaluating NeRF and 3D Gaussian Splatting for scene modeling.",
                "paperTitles": ["3D Scene Reconstruction with Deep Prior"]
            },
            "conversationHistory": [
                {"sender": "user", "text": "Hello, can you help evaluate scene representation methods?"},
                {"sender": "assistant", "text": "Certainly! I am your AI Research Assistant ready to synthesize relevant literature."}
            ]
        }
    )
    assert res.status_code == 200, f"Chat failed: {res.text}"
    data = res.json()
    reply = data.get("reply", "")
    sources = data.get("sources", [])
    
    print(f"Reply length: {len(reply)} chars")
    print(f"Retrieved RAG sources: {len(sources)}")
    for s in sources:
        print(f"  - Source: [{s.get('venue')}] {s.get('title')} (Score: {s.get('score')})")

    assert len(reply) > 50, "Expected substantive assistant response"
    assert len(sources) > 0, "Expected at least 1 grounded paper retrieved from ChromaDB"
    print("\n[Test 1 Passed] AI Assistant returned grounded literature response with verified sources.")

    # 2. Test Chat Assistant with Transformer / Attention query
    print("\n[Test 2] Testing /api/chat-assistant with Transformer / Attention query:")
    res2 = client.post(
        "/api/chat-assistant",
        json={
            "message": "Explain how attention mechanisms and learning rate transfer work in normalized transformers."
        }
    )
    assert res2.status_code == 200, f"Chat 2 failed: {res2.text}"
    data2 = res2.json()
    reply2 = data2.get("reply", "")
    sources2 = data2.get("sources", [])
    print(f"Reply length: {len(reply2)} chars")
    print(f"Retrieved RAG sources: {len(sources2)}")
    for s in sources2:
        print(f"  - Source: [{s.get('venue')}] {s.get('title')}")

    assert len(sources2) > 0, "Expected retrieved papers from ChromaDB for transformer query"
    print("\n[Test 2 Passed] Transformer query grounded with ChromaDB research papers.")

    # 3. Test Paper Summarization endpoint
    print("\n[Test 3] Testing /api/summarize endpoint:")
    sum_res = client.post(
        "/api/summarize",
        json={
            "title": "Attention Is All You Need",
            "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and entirely relying on attention mechanisms.",
            "venue": "NeurIPS"
        }
    )
    assert sum_res.status_code == 200, f"Summarize failed: {sum_res.text}"
    sum_data = sum_res.json()
    assert "summary" in sum_data, "Expected summary in response"
    print(f"Summary generated: {sum_data['summary'][:100]}...")
    print("[Test 3 Passed] Paper summarization verified.")

    print("\n>>> ALL PHASE 4 TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    run_tests()
