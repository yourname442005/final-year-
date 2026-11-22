import time
from chroma_config import get_processed_collection
from collection_manager import format_chroma_result
from embedding_service import embed_query
from ranking_service import get_abbreviation_expansions, rerank_candidates


def search_papers(query, top_k=5, candidate_k=50, profile=False, use_hf_api=False):
    if not query or not query.strip():
        return []

    metrics = {}

    start = time.time()
    expansions = get_abbreviation_expansions(query)
    metrics["abbreviation_expansion"] = time.time() - start

    start = time.time()
    expanded_query = " ".join([query] + expansions)
    query_embedding = embed_query(expanded_query, use_hf_api=use_hf_api)
    metrics["query_embedding"] = time.time() - start

    start = time.time()
    collection = get_processed_collection()
    total_papers = collection.count()
    metrics["collection_load"] = time.time() - start
    metrics["total_papers"] = total_papers

    if total_papers == 0:
        return []

    start = time.time()
    result = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(candidate_k, total_papers),
        include=["documents", "metadatas", "distances"],
    )
    candidates = format_chroma_result(result)
    metrics["vector_search"] = time.time() - start

    start = time.time()
    reranked = rerank_candidates(query, candidates, expansions=expansions)
    metrics["reranking"] = time.time() - start

    metrics["total_time"] = sum(metrics[k] for k in metrics if isinstance(metrics[k], float))

    if profile:
        return reranked[:top_k], metrics
    return reranked[:top_k]


def get_paper(paper_id):
    result = get_processed_collection().get(
        ids=[paper_id],
        include=["documents", "metadatas"],
    )
    records = format_chroma_result(result)
    return records[0] if records else None


def list_papers(limit=20, offset=0):
    result = get_processed_collection().get(
        limit=limit,
        offset=offset,
        include=["documents", "metadatas"],
    )
    return format_chroma_result(result)


def related_papers(paper_id, top_k=5):
    collection = get_processed_collection()
    source = collection.get(
        ids=[paper_id],
        include=["embeddings", "documents", "metadatas"],
    )
    source_records = format_chroma_result(source, include_embeddings=True)
    if not source_records:
        return []
    embedding = source_records[0].get("embedding")
    result = collection.query(
        query_embeddings=[embedding],
        n_results=min(top_k + 1, collection.count()),
        include=["documents", "metadatas", "distances"],
    )
    candidates = [
        record for record in format_chroma_result(result)
        if record["id"] != paper_id
    ]
    return candidates[:top_k]


def run_search_system():
    collection = get_processed_collection()
    if collection.count() == 0:
        print("Error: No processed papers found in ChromaDB.")
        return
    print(f"--- Engine Ready: {collection.count()} Chroma papers indexed ---")
    
    use_hf = input("Use Hugging Face API for embeddings? (y/n, default n): ").strip().lower() == "y"

    while True:
        user_input = input("\nSearch (or 'exit'): ").strip()
        if user_input.lower() == "exit":
            break
        if not user_input:
            continue

        print(f"Analyzing vector search for: '{user_input}'...")
        results, metrics = search_papers(user_input, top_k=5, candidate_k=50, profile=True, use_hf_api=use_hf)
        
        print("\n" + "="*60)
        print("PERFORMANCE METRICS:")
        print("="*60)
        print(f"Total papers in index: {metrics.get('total_papers', 0)}")
        print(f"Total search time: {metrics.get('total_time', 0):.4f}s")
        print(f"- Abbreviation expansion: {metrics.get('abbreviation_expansion', 0):.4f}s")
        print(f"- Query embedding: {metrics.get('query_embedding', 0):.4f}s")
        print(f"- Collection load: {metrics.get('collection_load', 0):.4f}s")
        print(f"- Vector search (HNSW): {metrics.get('vector_search', 0):.4f}s")
        print(f"- Reranking: {metrics.get('reranking', 0):.4f}s")
        print("="*60 + "\n")
        
        if results:
            print(f"Found {len(results)} top matches after hybrid reranking:")
            for index, result in enumerate(results, 1):
                metadata = result["metadata"]
                date_str = str(metadata.get("published", "Unknown Date"))[:10]
                print(f" [{index}] {metadata.get('title', 'Untitled')}")
                print(
                    f"     Relevance: {result['score']} "
                    f"(Vector: {result['vector_score']}, "
                    f"Title: {result['title_score']}, "
                    f"Keyword: {result['keyword_score']}, "
                    f"Phrase: {result['phrase_score']}) | Date: {date_str}"
                )
                print(f"     URL: {metadata.get('url', 'N/A')}")
        else:
            print("No relevant matches found.")


if __name__ == "__main__":
    run_search_system()
