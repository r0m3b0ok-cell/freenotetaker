import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard, exportAsText } from '@/services/storage';
import { toast } from 'sonner';

const TranscriptTab = () => {
  const { recordings, activeRecordingId, searchQuery } = useAppStore();
  const rec = recordings.find((r) => r.id === activeRecordingId);

  const highlighted = useMemo(() => {
    if (!rec?.transcript || !searchQuery) return rec?.transcript ?? null;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return rec.transcript.replace(regex, '<<HIGHLIGHT>>$1<</HIGHLIGHT>>');
  }, [rec?.transcript, searchQuery]);

  if (!rec) return <p className="text-sm text-muted-foreground p-4">Select a recording</p>;
  if (!rec.transcript) return <p className="text-sm text-muted-foreground p-4">No transcript yet. Click "Transcribe" to generate one.</p>;

  const parts = highlighted!.split(/(<<HIGHLIGHT>>.*?<\/HIGHLIGHT>>)/g);

  return (
    <div className="p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex gap-3 justify-end sticky top-0 bg-background/50 backdrop-blur-sm py-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
          onClick={() => { copyToClipboard(rec.transcript!); toast.success('Transcript copied to clipboard'); }}
        >
          <Copy className="h-3.5 w-3.5" /> Copy Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
          onClick={() => exportAsText(rec.transcript!, `${rec.name}-transcript.txt`)}
        >
          <Download className="h-3.5 w-3.5" /> Save as .txt
        </Button>
      </div>

      <div className="prose prose-invert prose-amber max-w-none">
        <div className="text-[15px] leading-[1.8] text-foreground/80 font-medium whitespace-pre-wrap selection:bg-primary/30">
          {parts.map((part, i) => {
            if (part.startsWith('<<HIGHLIGHT>>')) {
              const text = part.replace('<<HIGHLIGHT>>', '').replace('<</HIGHLIGHT>>', '');
              return (
                <mark key={i} className="bg-primary/20 text-primary border-b-2 border-primary/50 font-bold px-0.5 rounded-sm transition-all hover:bg-primary/30">
                  {text}
                </mark>
              );
            }
            return <span key={i} className="transition-opacity duration-300">{part}</span>;
          })}
        </div>
      </div>
      
      <div className="pt-12 flex items-center justify-center">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full max-w-xs" />
      </div>
    </div>
  );
};

export default TranscriptTab;
