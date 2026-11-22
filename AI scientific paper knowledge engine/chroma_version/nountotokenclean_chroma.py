import json
import re
from collections import Counter
from pathlib import Path

import spacy

from chroma_config import get_raw_collection
from collection_manager import (
    get_all_records,
    upsert_processed_papers,
)


try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("SpaCy model not found. Run: python -m spacy download en_core_web_sm")
    exit()


def process_scientific_text(text):
    text = re.sub(r"\$.*?\$", "", text)
    doc = nlp(text)
    academic_noise = {
        "revisit", "result", "find", "give", "determine", "completely", "choice",
        "live", "example", "assign", "case", "hand", "number", "various",
        "study", "paper", "approach", "provide", "show", "discuss", "conclusion",
        "author", "present", "propose", "work", "base", "new", "describe",
        "different", "furthermore", "step-wise", "identify",
    }
    weak_words = {
        "high", "low", "strong", "weak", "general", "current", "simple", "likely",
        "main", "major", "specific", "original", "new", "different", "consistent",
        "possible", "various", "particular", "nearby", "unique", "previous",
    }
    common_caps_noise = {
        "USA", "ALL", "SOME", "THE", "AND", "FOR", "ITS", "NEW", "ONE", "TWO",
    }
    corrections = {"datum": "data", "physic": "physics", "ai": "AI"}

    cleaned_keywords = []
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN", "ADJ"]:
            if not token.is_stop and not token.is_punct and not token.is_space:
                word = re.sub(r"[^a-zA-Z]", "", token.lemma_.lower())
                word = corrections.get(word, word)
                if len(word) > 2 and word not in academic_noise and word not in weak_words:
                    cleaned_keywords.append(word)

    important_phrases = []
    for chunk in doc.noun_chunks:
        phrase_raw = chunk.text.lower().strip().replace("\n", " ")
        phrase_clean = re.sub(r"[^a-z\s\-]", "", phrase_raw).strip()
        phrase_clean = re.sub(r"^[a-z]\s+", "", phrase_clean)
        phrase_clean = phrase_clean.strip("-").strip()
        words = phrase_clean.split()
        if len(phrase_clean) > 5:
            filtered_words = [
                word for word in words
                if word not in nlp.Defaults.stop_words
                and word not in academic_noise
                and word not in weak_words
            ]
            if len(filtered_words) >= 2:
                final_phrase = " ".join(filtered_words)
                bad_prefixes = ("k-", "d-", "x-", "low-", "multi-")
                if not final_phrase.startswith(bad_prefixes):
                    final_phrase = final_phrase.replace("datum", "data")
                    important_phrases.append(final_phrase)

    acronyms = [
        token.text for token in doc
        if token.text.isupper()
        and 1 < len(token.text) < 6
        and token.is_alpha
        and token.text not in common_caps_noise
    ]
    important_phrases.extend(acronyms)
    return list(dict.fromkeys(cleaned_keywords)), list(dict.fromkeys(important_phrases))


def process_raw_papers(reset=True, batch_size=64):
    raw_records = get_all_records(get_raw_collection())
    if not raw_records:
        print("Error: No input data found in Chroma raw collection.")
        return []

    print(f"Processing {len(raw_records)} papers with preserved SpaCy NLP logic...")
    processed = []
    all_summary = []
    for record in raw_records:
        paper = dict(record["metadata"])
        abstract = paper.get("abstract", "")
        keywords, phrases = process_scientific_text(abstract)
        paper["cleaned_keywords"] = keywords
        paper["important_phrases"] = phrases
        processed.append(paper)
        all_summary.extend(phrases)

    inserted = upsert_processed_papers(processed, reset=reset, batch_size=batch_size)
    print(f"\nSUCCESS! Saved {inserted} processed papers with embeddings to ChromaDB")
    print("\n--- TOP DISCOVERED CONCEPTS (Cleaned) ---")
    for concept, count in Counter(all_summary).most_common(10):
        print(f"{concept.upper()}: {count}")
    return processed


def import_processed_json(json_path, reset=True, batch_size=64):
    path = Path(json_path)
    papers = json.loads(path.read_text(encoding="utf-8"))
    inserted = upsert_processed_papers(papers, reset=reset, batch_size=batch_size)
    print(f"Imported {inserted} processed papers from {path}")
    return papers


if __name__ == "__main__":
    process_raw_papers()
