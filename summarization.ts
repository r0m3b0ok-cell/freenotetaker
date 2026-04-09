import { useAppStore } from '@/store/useAppStore';
import type { OllamaModel, SummaryMode } from '@/data/mockData';
import { getOpenRouterKey } from '@/lib/config';

const QUICK_PROMPT = "Summarize the following transcript into: key points (bullets), important ideas, and action items. Keep it concise.";
const DEEP_PROMPT = "Convert the following transcript into structured notes with headings, detailed definitions, and specific examples. Be thorough.";
const MERGE_PROMPT = "Combine these summaries into one cohesive document, removing any repetition while maintaining all key information:";

async function callOpenRouter(prompt: string, model: string): Promise<string> {
  const apiKey = getOpenRouterKey();
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'NoteFlow',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'OpenRouter request failed');
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function summarize(
  recordingId: string,
  model: OllamaModel,
  mode: SummaryMode
): Promise<string> {
  const store = useAppStore.getState();
  const recording = store.recordings.find((r) => r.id === recordingId);
  if (!recording || !recording.transcript) throw new Error('Transcript not found');

  store.updateRecording(recordingId, { status: 'summarizing' });
  store.setIsSummarizing(true);

  try {
    const words = recording.transcript.split(/\s+/);
    const CHUNK_SIZE = 4000; // Increased chunk size for better context
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      chunks.push(words.slice(i, i + CHUNK_SIZE).join(' '));
    }

    const prompt = mode === 'quick' ? QUICK_PROMPT : DEEP_PROMPT;
    const chunkSummaries: string[] = [];

    for (const chunk of chunks) {
      const summary = await callOpenRouter(`${prompt}\n\n${chunk}`, model);
      chunkSummaries.push(summary);
    }

    let finalSummary = chunkSummaries[0];
    if (chunkSummaries.length > 1) {
      finalSummary = await callOpenRouter(`${MERGE_PROMPT}\n\n${chunkSummaries.join('\n\n')}`, model);
    }

    // Auto-title from first line or default
    const firstLine = finalSummary.split('\n')[0].replace(/[#*]/g, '').trim();
    const title = firstLine.length > 5 && firstLine.length < 50 ? firstLine : (recording.name.startsWith('Recording') ? 'Summary — ' + new Date().toLocaleDateString() : recording.name);

    store.updateRecording(recordingId, {
      status: 'summarized',
      summary: finalSummary,
      name: title,
    });
    return finalSummary;
  } catch (error: any) {
    store.updateRecording(recordingId, { status: 'transcribed' });
    throw error;
  } finally {
    store.setIsSummarizing(false);
  }
}

export { summarize as mockSummarize };

export async function getFreeModels(): Promise<string[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${getOpenRouterKey()}` },
  });
  const data = await res.json();
  return data.data
    .filter((m: any) => m.pricing?.prompt === '0' || m.pricing?.prompt === 0)
    .map((m: any) => m.id)
    .sort();
}
