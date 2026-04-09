import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import TranscriptTab from './TranscriptTab';
import SummaryTab from './SummaryTab';
import NotesTab from './NotesTab';
import ChunkedProgress from '@/components/shared/ProgressBar';
import { transcribe } from '@/services/transcription';
import { summarize, getFreeModels } from '@/services/summarization';
import { toast } from 'sonner';
import { WHISPER_MODELS, SUMMARY_MODES } from '@/data/mockData';
import { FileText, BookOpen, StickyNote, Loader2 } from 'lucide-react';

const FALLBACK_MODELS = [
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-small-3.2-24b-instruct:free'
];

const ViewerPanel = () => {
  const {
    recordings, activeRecordingId, activeTab, setActiveTab,
    whisperModel, setWhisperModel, ollamaModel, setOllamaModel,
    summaryMode, setSummaryMode, transcriptionProgress, isSummarizing,
    freeModels, setFreeModels
  } = useAppStore();

  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true);
      try {
        const models = await getFreeModels();
        if (models.length > 0) {
          setFreeModels(models);
          // If current model is not in the new list, pick the first one
          if (!models.includes(ollamaModel)) {
            setOllamaModel(models[0]);
          }
        } else {
          setFreeModels(FALLBACK_MODELS);
        }
      } catch (err) {
        console.error('Failed to fetch models', err);
        setFreeModels(FALLBACK_MODELS);
      } finally {
        setIsLoadingModels(false);
      }
    };

    if (freeModels.length === 0) {
      fetchModels();
    }
  }, []);

  const rec = recordings.find((r) => r.id === activeRecordingId);

  if (!rec) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Select a recording to get started
      </div>
    );
  }

  const canTranscribe = rec.status === 'idle' && !transcriptionProgress.isActive;
  const canSummarize = rec.transcript && !isSummarizing && rec.status !== 'summarizing';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background/50 backdrop-blur-sm relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Action bar / Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-foreground truncate max-w-[400px]">
            {rec.name}
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Active Session
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Transcribe controls */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
            <Select value={whisperModel} onValueChange={(v) => setWhisperModel(v as typeof whisperModel)}>
              <SelectTrigger className="h-8 w-[100px] text-[10px] font-bold uppercase tracking-wider bg-transparent border-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {WHISPER_MODELS.map((m) => <SelectItem key={m} value={m} className="text-[10px] uppercase font-bold">{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!canTranscribe}
              className="h-8 text-[11px] font-bold uppercase tracking-wider gap-2 bg-primary hover:bg-amber-600 text-black shadow-lg shadow-primary/20"
              onClick={async () => {
                try {
                  await transcribe(rec.id);
                  toast.success('Transcription complete!');
                } catch (err: any) {
                  toast.error(`Transcription failed: ${err.message}`);
                }
              }}
            >
              <FileText className="h-3.5 w-3.5" /> Transcribe
            </Button>
          </div>

          <div className="w-px h-6 bg-white/10" />

          {/* Summarize controls */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
            <Select value={ollamaModel} onValueChange={(v) => setOllamaModel(v as typeof ollamaModel)} disabled={isLoadingModels}>
              <SelectTrigger className="h-8 w-[140px] text-[10px] font-bold uppercase tracking-wider bg-transparent border-none focus:ring-0">
                {isLoadingModels ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Syncing...</span>
                  </div>
                ) : (
                  <SelectValue />
                )}
              </SelectTrigger>
              <SelectContent className="glass-card">
                {(freeModels.length > 0 ? freeModels : FALLBACK_MODELS).map((m) => (
                  <SelectItem key={m} value={m} className="text-[10px] uppercase font-bold">
                    {m.split('/').pop()?.replace(':free', '') || m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={summaryMode} onValueChange={(v) => setSummaryMode(v as typeof summaryMode)}>
              <SelectTrigger className="h-8 w-[100px] text-[10px] font-bold uppercase tracking-wider bg-transparent border-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {SUMMARY_MODES.map((m) => <SelectItem key={m} value={m} className="text-[10px] uppercase font-bold">{m === 'quick' ? 'Quick' : 'Deep Notes'}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!canSummarize || isLoadingModels}
              className="h-8 text-[11px] font-bold uppercase tracking-wider gap-2 bg-secondary hover:bg-white/10 text-foreground border border-white/10"
              onClick={async () => {
                try {
                  await summarize(rec.id, ollamaModel, summaryMode);
                  toast.success('Summarization complete!');
                  setActiveTab('summary');
                } catch (err: any) {
                  toast.error(`Summarization failed: ${err.message}`);
                }
              }}
            >
              <BookOpen className="h-3.5 w-3.5" /> Summarize
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      {transcriptionProgress.isActive && (
        <div className="px-6 py-4 animate-fade-in">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-xl shadow-primary/5">
            <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-primary mb-3">Transcription Processing</h4>
            <ChunkedProgress />
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col min-h-0">
        <div className="px-6 py-2 border-b border-white/5 bg-black/10">
          <TabsList className="bg-white/5 border border-white/5 rounded-xl p-1 w-fit">
            <TabsTrigger value="transcript" className="text-[11px] font-bold uppercase tracking-wider gap-2 h-8 px-4 data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg transition-all duration-300">
              <FileText className="h-3.5 w-3.5" /> Transcript
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-[11px] font-bold uppercase tracking-wider gap-2 h-8 px-4 data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg transition-all duration-300">
              <BookOpen className="h-3.5 w-3.5" /> Summary
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-[11px] font-bold uppercase tracking-wider gap-2 h-8 px-4 data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg transition-all duration-300">
              <StickyNote className="h-3.5 w-3.5" /> Shared Notes
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto w-full">
            <TabsContent value="transcript" className="mt-0 animate-fade-in">
              <TranscriptTab />
            </TabsContent>
            <TabsContent value="summary" className="mt-0 animate-fade-in">
              <SummaryTab />
            </TabsContent>
            <TabsContent value="notes" className="mt-0 animate-fade-in">
              <NotesTab />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ViewerPanel;
