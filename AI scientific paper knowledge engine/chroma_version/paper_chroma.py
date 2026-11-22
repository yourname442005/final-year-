import json
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import requests

from collection_manager import extract_paper_id, upsert_raw_papers


def parse_arxiv_entry(entry, namespace):
    title = entry.find("atom:title", namespace).text.strip().replace("\n", " ")
    abstract = entry.find("atom:summary", namespace).text.strip().replace("\n", " ")
    url = entry.find("atom:id", namespace).text.strip()
    published = entry.find("atom:published", namespace).text.strip()
    updated = entry.find("atom:updated", namespace).text.strip()
    authors = [
        author.find("atom:name", namespace).text.strip()
        for author in entry.findall("atom:author", namespace)
        if author.find("atom:name", namespace) is not None
    ]
    categories = [
        category.attrib.get("term", "")
        for category in entry.findall("atom:category", namespace)
        if category.attrib.get("term")
    ]
    primary_category = categories[0] if categories else ""
    paper_id = extract_paper_id({"url": url})

    return {
        "id": paper_id,
        "title": title,
        "abstract": abstract,
        "authors": authors,
        "author_count": len(authors),
        "categories": categories,
        "primary_category": primary_category,
        "doi": "",
        "journal_reference": "",
        "comment": "",
        "url": url,
        "pdf_url": f"https://arxiv.org/pdf/{paper_id}.pdf",
        "published": published,
        "updated": updated,
    }


def fetch_arxiv_abstracts(total_records=5000, reset=True, batch_size=100):
    base_url = "https://export.arxiv.org/api/query"
    query = 'all:"machine learning" OR all:physics OR cat:cs.AI'
    papers = []
    print(f"Starting to download {total_records} abstracts...")

    for start in range(0, total_records, batch_size):
        params = {
            "search_query": query,
            "start": start,
            "max_results": batch_size,
            "sortBy": "submittedDate",
            "sortOrder": "descending",
        }
        headers = {"User-Agent": "AIScientificPaperKnowledgeEngine/1.0"}

        try:
            response = requests.get(base_url, params=params, headers=headers, timeout=30)
            if response.status_code == 429:
                print("Rate limit hit. Waiting 60 seconds before retrying...")
                time.sleep(60)
                continue
            if response.status_code != 200:
                print(f"Error fetching data. Status Code: {response.status_code}")
                break

            root = ET.fromstring(response.content)
            namespace = {"atom": "http://www.w3.org/2005/Atom"}
            entries = root.findall("atom:entry", namespace)
            if not entries:
                print("No more entries found.")
                break

            papers.extend(parse_arxiv_entry(entry, namespace) for entry in entries)
            print(f"Downloaded {len(papers)} / {total_records}...")
            time.sleep(3)
        except Exception as exc:
            print(f"An error occurred: {exc}")
            break

    inserted = upsert_raw_papers(papers, reset=reset)
    print(f"Done! Saved {inserted} raw papers to ChromaDB")
    return papers


def import_raw_json(json_path, reset=True):
    path = Path(json_path)
    papers = json.loads(path.read_text(encoding="utf-8"))
    inserted = upsert_raw_papers(papers, reset=reset)
    print(f"Imported {inserted} raw papers from {path}")
    return papers


if __name__ == "__main__":
    fetch_arxiv_abstracts(5000)
