import { create } from 'zustand';
import { mockRecordings } from '@/data/mockData';
import type { WhisperModel, OllamaModel, SummaryMode } from '@/data/mockData';

export interface Recording {
  id: string;
  name: string;
  date: string;
  duration: number; // seconds
  status: 'idle' | 'recording' | 'transcribing' | 'transcribed' | 'summarizing' | 'summarized';
  transcript: string | null;
  summary: string | null;
  notes: string;
}

interface TranscriptionProgress {
  currentChunk: number;
  totalChunks: number;
  isActive: boolean;
}

interface AppState {
  recordings: Recording[];
  activeRecordingId: string | null;
  activeTab: 'transcript' | 'summary' | 'notes';
  searchQuery: string;
  isRecording: boolean;
  recordingSeconds: number;
  whisperModel: WhisperModel;
  ollamaModel: OllamaModel;
  summaryMode: SummaryMode;
  transcriptionProgress: TranscriptionProgress;
  isSummarizing: boolean;
  freeModels: string[];

  // Actions
  setActiveRecording: (id: string) => void;
  setActiveTab: (tab: 'transcript' | 'summary' | 'notes') => void;
  setSearchQuery: (q: string) => void;
  addRecording: (rec: Recording) => void;
  updateRecording: (id: string, updates: Partial<Recording>) => void;
  setIsRecording: (val: boolean) => void;
  setRecordingSeconds: (val: number) => void;
  setWhisperModel: (m: WhisperModel) => void;
  setOllamaModel: (m: OllamaModel) => void;
  setSummaryMode: (m: SummaryMode) => void;
  setTranscriptionProgress: (p: TranscriptionProgress) => void;
  setIsSummarizing: (val: boolean) => void;
  setFreeModels: (models: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  recordings: mockRecordings,
  activeRecordingId: mockRecordings[0]?.id ?? null,
  activeTab: 'transcript',
  searchQuery: '',
  isRecording: false,
  recordingSeconds: 0,
  whisperModel: 'large',
  ollamaModel: 'mistralai/mistral-7b-instruct:free',
  summaryMode: 'quick',
  transcriptionProgress: { currentChunk: 0, totalChunks: 0, isActive: false },
  isSummarizing: false,
  freeModels: [],

  setActiveRecording: (id) => set({ activeRecordingId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  addRecording: (rec) => set((s) => ({ recordings: [rec, ...s.recordings], activeRecordingId: rec.id })),
  updateRecording: (id, updates) =>
    set((s) => ({
      recordings: s.recordings.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  setIsRecording: (val) => set({ isRecording: val }),
  setRecordingSeconds: (val) => set({ recordingSeconds: val }),
  setWhisperModel: (m) => set({ whisperModel: m }),
  setOllamaModel: (m) => set({ ollamaModel: m }),
  setSummaryMode: (m) => set({ summaryMode: m }),
  setTranscriptionProgress: (p) => set({ transcriptionProgress: p }),
  setIsSummarizing: (val) => set({ isSummarizing: val }),
  setFreeModels: (models) => set({ freeModels: models }),
}));
