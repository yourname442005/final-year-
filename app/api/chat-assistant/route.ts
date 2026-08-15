import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message, projectContext, paperContext, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        let systemInstruction = `You are the AI Research Assistant for the AI-Native Research Intelligence Platform.
Your role is to assist researchers with paper analysis, literature synthesis, experimental design, and project planning.
Maintain a precise, scholarly, encouraging tone. Reference specific paper claims or methodology when provided.
Always label your advice clearly and avoid fabricating facts or citations.`;

        if (projectContext) {
          systemInstruction += `\nCurrent Project Context:
Project Name: ${projectContext.name || 'Research Project'}
Field: ${projectContext.field || 'General Research'}
Description: ${projectContext.description || ''}
Associated Papers: ${projectContext.paperTitles ? projectContext.paperTitles.join('; ') : 'None'}`;
        }

        if (paperContext) {
          systemInstruction += `\nCurrently Selected Paper Context:
Title: ${paperContext.title}
Abstract: ${paperContext.abstract}`;
        }

        const formattedPrompt = `${conversationHistory.length > 0 ? 'Conversation History:\n' + conversationHistory.map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`).join('\n') + '\n\n' : ''}Researcher User Question: ${message}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: formattedPrompt,
          config: {
            systemInstruction
          }
        });

        if (response.text) {
          return NextResponse.json({ reply: response.text.trim() });
        }
      } catch (e) {
        console.warn('Gemini chat-assistant failed, falling back to heuristic assistant response:', e);
      }
    }

    // Heuristic fallback
    const fallbackReply = `Regarding your query "${message}":
Based on the current research context, here are three recommended steps:
1. **Literature Synthesis**: Verify if related findings in similar benchmarks confirm this methodology.
2. **Experimental Design**: Set up a baseline comparison isolating the primary variable.
3. **Documentation**: Record your observations in the project notes section for team review.

How else can I assist with your workspace or literature analysis?`;

    return NextResponse.json({ reply: fallbackReply });
  } catch (error) {
    console.error('Chat Assistant API error:', error);
    return NextResponse.json({ error: 'Failed to generate assistant response' }, { status: 500 });
  }
}
