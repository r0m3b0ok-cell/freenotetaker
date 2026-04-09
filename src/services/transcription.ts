import { useAppStore } from '@/store/useAppStore';
import { getGroqKey } from '@/lib/config';

export const recordingStore = new Map<string, Blob | File>();

async function encodeWAV(audioBuffer: AudioBuffer): Promise<Blob> {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + audioBuffer.length * blockAlign);
  const view = new DataView(buffer);

  const writeString = (v: DataView, o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioBuffer.length * blockAlign, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, audioBuffer.length * blockAlign, true);

  const offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset + (i * blockAlign) + (channel * bytesPerSample), intSample, true);
    }
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export async function transcribe(recordingId: string): Promise<string> {
  const store = useAppStore.getState();
  const blob = recordingStore.get(recordingId);
  if (!blob) throw new Error('Recording not found');

  store.updateRecording(recordingId, { status: 'transcribing' });

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const CHUNK_SIZE_SEC = 600; // 10 minutes
    const totalDuration = audioBuffer.duration;
    const totalChunks = Math.ceil(totalDuration / CHUNK_SIZE_SEC);

    store.setTranscriptionProgress({ currentChunk: 0, totalChunks, isActive: true });

    let fullTranscript = '';
    const apiKey = getGroqKey();

    for (let i = 0; i < totalChunks; i++) {
      const startOffset = i * CHUNK_SIZE_SEC;
      const endOffset = Math.min(startOffset + CHUNK_SIZE_SEC, totalDuration);
      const chunkDuration = endOffset - startOffset;

      const chunkAudioBuffer = audioCtx.createBuffer(
        audioBuffer.numberOfChannels,
        Math.floor(chunkDuration * audioBuffer.sampleRate),
        audioBuffer.sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        chunkAudioBuffer.copyToChannel(
          audioBuffer.getChannelData(channel).slice(
            Math.floor(startOffset * audioBuffer.sampleRate),
            Math.floor(endOffset * audioBuffer.sampleRate)
          ),
          channel
        );
      }

      const chunkBlob = await encodeWAV(chunkAudioBuffer);
      const form = new FormData();
      form.append('file', chunkBlob, 'chunk.wav');
      form.append('model', 'whisper-large-v3');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Transcription failed');
      }

      const result = await response.json();
      fullTranscript += (fullTranscript ? ' ' : '') + result.text;
      store.setTranscriptionProgress({ currentChunk: i + 1, totalChunks, isActive: true });
    }

    store.updateRecording(recordingId, { status: 'transcribed', transcript: fullTranscript });
    return fullTranscript;
  } catch (error: any) {
    store.updateRecording(recordingId, { status: 'idle' });
    throw error;
  } finally {
    store.setTranscriptionProgress({ currentChunk: 0, totalChunks: 0, isActive: false });
  }
}

export { transcribe as mockTranscribe };
