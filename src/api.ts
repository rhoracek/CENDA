import type { ApiMessage } from './types';
import { SYSTEM_PROMPT } from './systemPrompt';

export async function callClaude(messages: ApiMessage[]): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content
    ?.filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('\n') ?? 'Omlouvám se, nepodařilo se získat odpověď.';
}

export function parseResponse(raw: string) {
  let mainText = raw;
  let sources: { name: string; url: string; desc?: string }[] = [];
  let related: string[] = [];

  const srcMatch = raw.match(/---SOURCES---\s*([\s\S]*?)---END---/);
  if (srcMatch) {
    try { sources = JSON.parse(srcMatch[1].trim()); } catch (_) { /* ignore */ }
    mainText = mainText.replace(/---SOURCES---[\s\S]*?---END---/, '').trim();
  }

  const relMatch = mainText.match(/---RELATED---\s*([\s\S]*?)---END---/);
  if (relMatch) {
    related = relMatch[1].split('|').map((s) => s.trim()).filter(Boolean);
    mainText = mainText.replace(/---RELATED---[\s\S]*?---END---/, '').trim();
  }

  return { mainText, sources, related };
}
