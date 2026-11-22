# Performance Analysis & Time Complexity

## Overview
This document explains the time complexity and performance optimizations for the AI Scientific Paper Knowledge Engine's vector search system.

## Time Complexity Analysis

### 1. Vector Search (HNSW Index)
- **Algorithm**: Hierarchical Navigable Small Worlds (HNSW)
- **Time Complexity**: 
  - **Search**: O(log N), where N is the number of vectors in the index
  - **Space**: O(N * M), where M is the number of neighbors per node
- **Why HNSW?**: It provides fast approximate nearest neighbor search with good recall.

### 2. Query Embedding
- **Local Model**: O(d * t), where d is the embedding dimension and t is the text length
- **HF API**: Network latency + O(d * t) (processing on HF servers)

### 3. Reranking
- **Time Complexity**: O(K * (t1 + t2)), where K is the number of candidates, t1 is query length, t2 is document length

## Optimizations Applied

### 1. ChromaDB HNSW Parameters
We optimized the HNSW index parameters in `chroma_config.py`:
- `hnsw:M`: 16 (number of neighbors per node, balances speed and recall)
- `hnsw:ef_construction`: 100 (controls index build quality)
- `hnsw:ef_search`: 64 (controls search quality/speed tradeoff)

### 2. Embedding Service
- Added support for both **local Sentence-Transformers model** and **Hugging Face Inference API**
- Cached embedding model for local use

## How to Use

### With Local Embedding Model
1. No special configuration needed
2. Run `python search_engine_chroma.py`
3. Answer "n" when asked about HF API

### With Hugging Face API
1. Get a free HF token from https://huggingface.co/settings/tokens
2. Add `HF_TOKEN=your_token_here` to your `.env` file
3. Run `python search_engine_chroma.py`
4. Answer "y" when asked about HF API

## Performance Metrics Displayed
When running a search, you'll see:
- Total papers in index
- Total search time
- Breakdown of each step (abbreviation expansion, query embedding, vector search, reranking)
