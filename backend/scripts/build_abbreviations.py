#!/usr/bin/env python3
"""Extract scientific abbreviations from the 5,000 papers and save to ChromaDB
abbreviations collection and a JSON map for ultra-fast lookup.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from collections import defaultdict

scripts_dir = Path(__file__).resolve().parent
backend_dir = scripts_dir.parent
workspace_dir = backend_dir.parent
sys.path.insert(0, str(backend_dir))

from app.core.chroma_service import get_abbreviation_collection


def extract_abbreviations_from_text(text: str) -> list[tuple[str, str]]:
    pattern = r"\b([A-Z][A-Za-z0-9\-]+(?:\s+[A-Za-z0-9\-]+){1,5})\s*\(([A-Z]{2,8})\)"
    return re.findall(pattern, text or "")


def main():
    json_path = workspace_dir / "AI scientific paper knowledge engine" / "after_cleaning_final_research_data.json"
    if not json_path.exists():
        print(f"File not found: {json_path}")
        return

    print("Extracting abbreviations from 5,000 papers...")
    with open(json_path, "r", encoding="utf-8") as f:
        papers = json.load(f)

    mapping: dict[str, set[str]] = defaultdict(set)

    # Core built-ins for AI & Science
    BUILTINS = {
        "LLM": ["Large Language Model", "Large Language Models"],
        "LLMS": ["Large Language Models"],
        "GNN": ["Graph Neural Network", "Graph Neural Networks"],
        "GNNS": ["Graph Neural Networks"],
        "CNN": ["Convolutional Neural Network", "Convolutional Neural Networks"],
        "RNN": ["Recurrent Neural Network"],
        "NLP": ["Natural Language Processing", "Computational Linguistics"],
        "CV": ["Computer Vision", "3D Scene Understanding"],
        "RL": ["Reinforcement Learning"],
        "RLHF": ["Reinforcement Learning from Human Feedback"],
        "NERF": ["Neural Radiance Field", "Neural Radiance Fields"],
        "SLAM": ["Simultaneous Localization and Mapping"],
        "VLM": ["Vision-Language Model", "Vision-Language Models"],
        "VLMS": ["Vision-Language Models"],
        "VAE": ["Variational Autoencoder", "Variational Autoencoders"],
        "GAN": ["Generative Adversarial Network", "Generative Adversarial Networks"],
        "SVD": ["Singular Value Decomposition"],
        "PINN": ["Physics-Informed Neural Network", "Physics-Informed Neural Networks"],
        "BEV": ["Bird's Eye View", "Bird's-Eye-View Representation"],
        "ODE": ["Ordinary Differential Equation", "Ordinary Differential Equations"],
        "PDE": ["Partial Differential Equation", "Partial Differential Equations"],
        "QFT": ["Quantum Field Theory"],
        "CFT": ["Conformal Field Theory"],
        "ADS": ["Anti-de Sitter Space"],
        "RAG": ["Retrieval-Augmented Generation"],
        "LORA": ["Low-Rank Adaptation"],
        "MOE": ["Mixture of Experts"],
        "MMPA": ["Matched Molecular Pair Analysis"],
    }

    for abbr, fulls in BUILTINS.items():
        for full in fulls:
            mapping[abbr].add(full)

    for p in papers:
        text = f"{p.get('title', '')} {p.get('abstract', '')}"
        for full_form, short_form in extract_abbreviations_from_text(text):
            cleaned_full = full_form.strip()
            cleaned_short = short_form.strip().upper()
            if len(cleaned_full) > 4 and len(cleaned_short) >= 2:
                mapping[cleaned_short].add(cleaned_full)

    print(f"Discovered {len(mapping)} distinct scientific acronyms!")

    # Format for JSON and Chroma
    clean_dict: dict[str, list[str]] = {}
    ids = []
    documents = []
    metadatas = []

    for short_form, full_forms in sorted(mapping.items()):
        expansions = sorted(full_forms)
        clean_dict[short_form] = expansions
        ids.append(short_form)
        documents.append(f"{short_form}: {', '.join(expansions)}")
        metadatas.append({
            "abbr": short_form,
            "expansions": json.dumps(expansions),
        })

    # Save to JSON in backend/var/abbreviations.json for zero-latency lookup
    var_dir = backend_dir / "var"
    var_dir.mkdir(parents=True, exist_ok=True)
    out_json = var_dir / "abbreviations.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(clean_dict, f, indent=2)
    print(f"Saved abbreviations map to {out_json}")

    # Upsert into ChromaDB abbreviations collection in batches
    collection = get_abbreviation_collection()
    batch_size = 100
    for i in range(0, len(ids), batch_size):
        collection.upsert(
            ids=ids[i:i + batch_size],
            documents=documents[i:i + batch_size],
            metadatas=metadatas[i:i + batch_size],
        )

    print(f"ChromaDB abbreviations collection updated! Total records: {collection.count()}", flush=True)


if __name__ == "__main__":
    main()
