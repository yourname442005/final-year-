"""Precompute nearest-neighbor semantic relationships in ChromaDB and store them in SQLite related_papers.

This makes GET /api/v1/papers/{id}/related a single indexed SQL join (<2ms).
"""

import os
import sys
import uuid
from pathlib import Path

# Set up paths
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

# Ensure SQLite database URL is set
db_path = (BACKEND_DIR / "ckgai_dev.db").resolve()
os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"

from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session

from app.core.chroma_service import get_processed_collection
from app.models.paper import Paper, RelatedPaper


def precompute_related():
    print(f"Connecting to database: {db_path}")
    engine = create_engine(f"sqlite:///{db_path}")
    
    collection = get_processed_collection()
    total_in_chroma = collection.count()
    print(f"ChromaDB processed_papers collection has {total_in_chroma} embeddings.")
    
    if total_in_chroma == 0:
        print("No papers found in ChromaDB.")
        return

    with Session(engine) as session:
        # 1. Fetch map of external_id -> internal Paper.id
        print("Loading paper ID mapping from SQLite...")
        rows = session.execute(select(Paper.id, Paper.external_id).where(Paper.external_id.isnot(None))).all()
        ext_to_internal = {ext: pid for pid, ext in rows if ext}
        internal_to_ext = {pid: ext for ext, pid in ext_to_internal.items()}
        print(f"Loaded {len(ext_to_internal)} papers with external_id from SQLite.")

        # 2. Retrieve all IDs and embeddings from ChromaDB in batches
        all_chroma_data = collection.get(include=["embeddings"])
        chroma_ids = all_chroma_data.get("ids", [])
        chroma_embeddings = all_chroma_data.get("embeddings", [])

        print(f"Retrieved {len(chroma_ids)} embeddings from ChromaDB.")

        # Filter only those that exist in SQLite
        valid_indices = [i for i, cid in enumerate(chroma_ids) if cid in ext_to_internal]
        query_ids = [chroma_ids[i] for i in valid_indices]
        query_embs = [chroma_embeddings[i] for i in valid_indices]

        print(f"Papers matching SQLite catalog: {len(query_ids)}")

        # 3. Clear existing related_papers to avoid duplicates
        existing_count = session.execute(select(text("COUNT(*)")).select_from(RelatedPaper)).scalar() or 0
        print(f"Existing related_papers count: {existing_count}")
        if existing_count > 0:
            print("Purging stale related_papers rows...")
            session.execute(text("DELETE FROM related_papers"))
            session.commit()

        # 4. Query nearest neighbors in batches of 100
        batch_size = 100
        total_inserted = 0
        new_relations = []

        for start_idx in range(0, len(query_ids), batch_size):
            end_idx = min(start_idx + batch_size, len(query_ids))
            batch_query_ids = query_ids[start_idx:end_idx]
            batch_query_embs = query_embs[start_idx:end_idx]

            # Query Chroma for top 5 (first is the paper itself)
            res = collection.query(
                query_embeddings=batch_query_embs,
                n_results=5,
                include=["distances"]
            )

            result_ids_list = res.get("ids", [])
            result_dists_list = res.get("distances", [])

            for i, source_ext_id in enumerate(batch_query_ids):
                source_internal_id = ext_to_internal[source_ext_id]
                match_ids = result_ids_list[i] if i < len(result_ids_list) else []
                match_dists = result_dists_list[i] if i < len(result_dists_list) else []

                neighbors_count = 0
                for target_ext_id, dist in zip(match_ids, match_dists):
                    if target_ext_id == source_ext_id:
                        continue
                    if target_ext_id not in ext_to_internal:
                        continue
                    target_internal_id = ext_to_internal[target_ext_id]
                    score = round(max(0.0, 1.0 - float(dist)), 4)

                    new_relations.append({
                        "id": str(uuid.uuid4()),
                        "paper_id": source_internal_id,
                        "related_to_id": target_internal_id,
                        "score": score
                    })
                    neighbors_count += 1
                    if neighbors_count >= 3:
                        break

            if len(new_relations) >= 500:
                session.execute(
                    text("INSERT INTO related_papers (id, paper_id, related_to_id, score) VALUES (:id, :paper_id, :related_to_id, :score)"),
                    new_relations
                )
                session.commit()
                total_inserted += len(new_relations)
                new_relations = []
                print(f"Progress: processed {end_idx}/{len(query_ids)} papers, inserted {total_inserted} edges...")

        if new_relations:
            session.execute(
                text("INSERT INTO related_papers (id, paper_id, related_to_id, score) VALUES (:id, :paper_id, :related_to_id, :score)"),
                new_relations
            )
            session.commit()
            total_inserted += len(new_relations)

        print(f"Successfully populated {total_inserted} related paper relations into related_papers table!")


if __name__ == "__main__":
    precompute_related()
