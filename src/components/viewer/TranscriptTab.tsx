import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Copy, Download, Edit2, Layout, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { copyToClipboard, exportAsText } from '@/services/storage';
import { toast } from 'sonner';

const TranscriptTab = () => {
  const { recordings, activeRecordingId, searchQuery, updateRecording } = useAppStore();
  const rec = recordings.find((r) => r.id === activeRecordingId);
  const [isEditing, setIsEditing] = useState(false);

  const highlighted = useMemo(() => {
    if (!rec?.transcript || !searchQuery) return rec?.transcript ?? null;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return rec.transcript.replace(regex, '<<HIGHLIGHT>>$1<</HIGHLIGHT>>');
  }, [rec?.transcript, searchQuery]);

  if (!rec) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-fade-in">
        Select a recording to view transcript
      </div>
    );
  }

  if (!rec.transcript) {
    return (
      <div className="p-12 text-center space-y-4 animate-fade-in">
        <div className="mx-auto h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
          <FileText className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
          No transcript available yet. Please click the <span className="text-primary font-bold">Transcribe</span> button in the top bar.
        </p>
      </div>
    );
  }

  const parts = highlighted!.split(/(<<HIGHLIGHT>>.*?<\/HIGHLIGHT>>)/g);

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex gap-3 justify-between sticky top-0 bg-background/50 backdrop-blur-sm py-2 z-10">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
          >
            {isEditing ? (
              <><Layout className="h-3.5 w-3.5 text-primary" /> View Formatted</>
            ) : (
              <><Edit2 className="h-3.5 w-3.5 text-primary" /> Edit Transcript</>
            )}
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
            onClick={() => { copyToClipboard(rec.transcript!); toast.success('Transcript copied'); }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
            onClick={() => exportAsText(rec.transcript!, `${rec.name}-transcript.txt`)}
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      <div className="animate-fade-in">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-primary/60 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Editing Mode
            </div>
            <Textarea
              value={rec.transcript || ''}
              onChange={(e) => updateRecording(rec.id, { transcript: e.target.value })}
              className="min-h-[500px] bg-black/40 border-white/10 p-6 text-[15px] leading-relaxed rounded-2xl focus:border-primary/50 transition-all resize-none font-medium"
              placeholder="Type or paste transcript here..."
            />
          </div>
        ) : (
          <div className="prose prose-invert prose-amber max-w-none">
            <div className="text-[15px] leading-[1.8] text-foreground/80 font-medium whitespace-pre-wrap selection:bg-primary/30 p-1">
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
        )}
      </div>
      
      <div className="pt-12 flex items-center justify-center">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full max-w-xs" />
      </div>
    </div>
  );
};

export default TranscriptTab;
