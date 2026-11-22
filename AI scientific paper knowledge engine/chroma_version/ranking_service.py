import json
import re

from chroma_config import get_abbreviation_collection
from collection_manager import get_all_records, json_dumps, reset_collection
from embedding_service import embed_texts


def normalize(text):
    if not text:
        return ""
    text = text.lower().strip()
    return re.sub(r"s\b", "", text)


def parse_list(value):
    if isinstance(value, list):
        return value
    if not value:
        return []
    try:
        loaded = json.loads(value)
        return loaded if isinstance(loaded, list) else []
    except (TypeError, json.JSONDecodeError):
        return []


def extract_abbreviations_from_text(text):
    pattern = r"\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)+)\s*\(([A-Z]{2,6})\)"
    return re.findall(pattern, text or "")


def rebuild_abbreviation_collection(processed_records):
    collection = reset_collection("abbreviations")
    mapping = {}
    for record in processed_records:
        metadata = record["metadata"]
        text = " ".join(
            [
                metadata.get("title", ""),
                metadata.get("abstract", ""),
                " ".join(parse_list(metadata.get("important_phrases"))),
            ]
        )
        for full_form, short_form in extract_abbreviations_from_text(text):
            mapping.setdefault(short_form, set()).add(full_form)

    if not mapping:
        return 0

    ids = []
    documents = []
    metadatas = []
    for short_form, full_forms in sorted(mapping.items()):
        expansions = sorted(full_forms)
        ids.append(short_form)
        documents.append(f"{short_form}: {', '.join(expansions)}")
        metadatas.append(
            {
                "abbr": short_form,
                "expansions": json_dumps(expansions),
                "schema_version": 1,
            }
        )

    embeddings = embed_texts(documents, batch_size=64)
    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
        embeddings=embeddings,
    )
    return len(ids)


def get_abbreviation_expansions(query):
    upper_query = query.upper().strip()
    if not upper_query or upper_query != query.strip().upper():
        return []
    result = get_abbreviation_collection().get(
        ids=[upper_query],
        include=["metadatas"],
    )
    metadatas = result.get("metadatas", [])
    if not metadatas:
        return []
    return parse_list(metadatas[0].get("expansions"))


def vector_score_from_distance(distance):
    if distance is None:
        return 0.0
    return max(0.0, 1.0 - float(distance))


def lexical_scores(query_terms, metadata):
    title_norm = normalize(metadata.get("title", ""))
    keywords = [normalize(value) for value in parse_list(metadata.get("cleaned_keywords"))]
    phrases = [normalize(value) for value in parse_list(metadata.get("important_phrases"))]

    title_score = 0
    keyword_score = 0
    phrase_score = 0
    for term in query_terms:
        q = normalize(term)
        if not q:
            continue
        if q == title_norm:
            title_score = max(title_score, 1.0)
        elif q in title_norm:
            title_score = max(title_score, 0.5)
        if any(q == keyword for keyword in keywords):
            keyword_score = max(keyword_score, 1.0)
        if any(q == phrase for phrase in phrases):
            phrase_score = max(phrase_score, 1.0)
        elif any(q in phrase for phrase in phrases):
            phrase_score = max(phrase_score, 0.4)
    return title_score, keyword_score, phrase_score


def recency_score(metadata):
    published = str(metadata.get("published", ""))
    match = re.match(r"(\d{4})", published)
    if not match:
        return 0.0
    year = int(match.group(1))
    return max(0.0, min(1.0, (year - 1990) / 40))


def rerank_candidates(query, candidates, expansions=None):
    query_terms = [query] + list(expansions or [])
    reranked = []
    for candidate in candidates:
        metadata = candidate["metadata"]
        vector_score = vector_score_from_distance(candidate.get("distance"))
        title_score, keyword_score, phrase_score = lexical_scores(query_terms, metadata)
        freshness = recency_score(metadata)
        final_score = (
            0.60 * vector_score
            + 0.15 * title_score
            + 0.10 * keyword_score
            + 0.10 * phrase_score
            + 0.05 * freshness
        )
        reranked.append(
            {
                **candidate,
                "score": round(final_score * 100, 2),
                "vector_score": round(vector_score * 100, 2),
                "title_score": round(title_score * 100, 2),
                "keyword_score": round(keyword_score * 100, 2),
                "phrase_score": round(phrase_score * 100, 2),
                "recency_score": round(freshness * 100, 2),
            }
        )
    return sorted(
        reranked,
        key=lambda item: (item["score"], item["metadata"].get("published", "")),
        reverse=True,
    )


def rebuild_abbreviations_from_processed_collection(processed_collection):
    records = get_all_records(processed_collection)
    return rebuild_abbreviation_collection(records)
