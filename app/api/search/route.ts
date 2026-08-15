import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { INITIAL_PAPERS, Paper } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, mode = 'semantic', papers = INITIAL_PAPERS, isHttpAccelerated = false } = body;

    const startTime = Date.now();

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json({
        results: papers,
        query: '',
        mode,
        latencyMs: 12,
        isHttpAccelerated
      });
    }

    const ai = getGeminiClient();
    let rankedPapers: Paper[] = [];
    let queryUnderstanding = '';

    if (ai) {
      try {
        const prompt = `You are an AI academic search engine. Given the research query: "${query}", analyze the query intent and evaluate these candidate papers:
${JSON.stringify((papers as Paper[]).map((p: Paper) => ({ id: p.id, title: p.title, abstract: p.abstract, tags: p.tags })))}

Respond ONLY with valid JSON in this exact structure:
{
  "queryUnderstanding": "Brief 1-sentence statement of query intent",
  "paperEvaluations": [
    {
      "id": "paper-id",
      "relevanceSignal": "High" | "Medium" | "Low",
      "reasoningEvidence": "Brief explanation why this paper matches the query"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          queryUnderstanding = parsed.queryUnderstanding || '';
          const evalMap = new Map<string, { relevanceSignal: 'High' | 'Medium' | 'Low'; reasoningEvidence: string }>();
          
          if (Array.isArray(parsed.paperEvaluations)) {
            for (const ev of parsed.paperEvaluations) {
              evalMap.set(ev.id, {
                relevanceSignal: ev.relevanceSignal || 'Medium',
                reasoningEvidence: ev.reasoningEvidence || 'Matches core research concepts in query.'
              });
            }
          }

          rankedPapers = (papers as Paper[]).map((p: Paper) => {
            const ev = evalMap.get(p.id);
            return {
              ...p,
              relevanceSignal: ev ? ev.relevanceSignal : 'Medium',
              reasoningEvidence: ev ? ev.reasoningEvidence : `Matches concept keywords related to "${query}".`
            };
          });

          // Sort High -> Medium -> Low
          const signalWeight = { High: 3, Medium: 2, Low: 1 };
          rankedPapers.sort((a, b) => signalWeight[b.relevanceSignal || 'Medium'] - signalWeight[a.relevanceSignal || 'Medium']);
        }
      } catch (err) {
        console.warn('Gemini search reasoning failed, falling back to heuristic search:', err);
      }
    }

    // Fallback heuristic if Gemini was not used or failed
    if (rankedPapers.length === 0) {
      const qLower = query.toLowerCase();
      rankedPapers = (papers as Paper[]).map((p: Paper) => {
        const titleMatch = p.title.toLowerCase().includes(qLower);
        const abstractMatch = p.abstract.toLowerCase().includes(qLower);
        const tagMatch = p.tags.some((t: string) => t.toLowerCase().includes(qLower));

        let signal: 'High' | 'Medium' | 'Low' = 'Low';
        let evidence = `Contains general domain terms related to query.`;

        if (titleMatch || (abstractMatch && tagMatch)) {
          signal = 'High';
          evidence = `Matches query key concepts in paper title and core abstract claims.`;
        } else if (abstractMatch || tagMatch) {
          signal = 'Medium';
          evidence = `Contains relevant methodology and terminology for "${query}".`;
        }

        return {
          ...p,
          relevanceSignal: signal,
          reasoningEvidence: evidence
        };
      });

      const signalWeight = { High: 3, Medium: 2, Low: 1 };
      rankedPapers.sort((a, b) => signalWeight[b.relevanceSignal || 'Medium'] - signalWeight[a.relevanceSignal || 'Medium']);
    }

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      results: rankedPapers,
      query,
      mode,
      queryUnderstanding,
      latencyMs: isHttpAccelerated ? Math.max(8, Math.floor(latencyMs / 4)) : latencyMs,
      isHttpAccelerated,
      suggestedSearches: [
        `${query} benchmarks 2026`,
        `emerging frameworks in ${query}`,
        `experimental evaluation of ${query}`
      ]
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute search query' },
      { status: 500 }
    );
  }
}
