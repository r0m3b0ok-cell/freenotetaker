import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { copyToClipboard, exportAsText } from '@/services/storage';
import { toast } from 'sonner';

const NotesTab = () => {
  const { recordings, activeRecordingId, updateRecording } = useAppStore();
  const rec = recordings.find((r) => r.id === activeRecordingId);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rec || !activeRecordingId) return;

    // Load from localStorage if Zustand notes are empty
    if (!rec.notes) {
      const savedNotes = localStorage.getItem(`notes-${activeRecordingId}`);
      if (savedNotes) {
        updateRecording(activeRecordingId, { notes: savedNotes });
      }
    }
  }, [activeRecordingId, rec, updateRecording]);

  const handleChange = (val: string) => {
    if (!rec) return;
    updateRecording(rec.id, { notes: val });

    // Save to localStorage debounced 500ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(`notes-${rec.id}`, val);
    }, 500);
  };

  if (!rec) return <p className="text-sm text-muted-foreground p-4">Select a recording</p>;

  return (
    <div className="p-8 space-y-6 max-w-3xl mx-auto h-full flex flex-col">
      <div className="flex gap-3 justify-end sticky top-0 bg-background/50 backdrop-blur-sm py-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
          onClick={() => { copyToClipboard(rec.notes); toast.success('Notes copied to clipboard'); }}
        >
          <Copy className="h-3.5 w-3.5" /> Copy Notes
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
          onClick={() => exportAsText(rec.notes, `${rec.name}-notes.txt`)}
        >
          <Download className="h-3.5 w-3.5" /> Save as .txt
        </Button>
      </div>
      
      <div className="flex-1 relative group animate-fade-in">
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <Textarea
          value={rec.notes}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Star writing your insights here..."
          className="w-full flex-1 min-h-[500px] bg-black/20 border-white/5 text-foreground placeholder:text-muted-foreground/30 
            resize-none text-[15px] leading-[1.8] font-medium p-6 rounded-2xl focus:ring-1 focus:ring-primary/20 
            focus:border-primary/30 transition-all shadow-inner backdrop-blur-sm"
        />
      </div>

      <div className="pt-8 flex items-center justify-between text-muted-foreground/40 text-[10px] uppercase font-bold tracking-[0.2em] px-2">
        <span>Drafting Mode</span>
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          <span>Autosaved to Local Storage</span>
        </div>
      </div>
    </div>
  );
};

export default NotesTab;
