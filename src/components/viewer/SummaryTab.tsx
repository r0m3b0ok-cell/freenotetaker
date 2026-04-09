import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Copy, Download, BookOpen, Edit2, Layout, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { copyToClipboard, exportAsText } from '@/services/storage';
import { toast } from 'sonner';

const SummaryTab = () => {
  const { recordings, activeRecordingId, isSummarizing, updateRecording } = useAppStore();
  const rec = recordings.find((r) => r.id === activeRecordingId);
  const [isEditing, setIsEditing] = useState(false);

  if (!rec) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-fade-in">
        Select a recording to view insights
      </div>
    );
  }

  if (isSummarizing) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-primary animate-bounce" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground">Distilling Insights</h3>
          <p className="text-sm text-muted-foreground">The AI is analyzing your transcript...</p>
        </div>
      </div>
    );
  }

  if (!rec.summary) {
    return (
      <div className="p-12 text-center space-y-3 animate-fade-in">
        <div className="mx-auto h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
          No summary yet. Transcribe your recording first, then click <span className="text-primary font-bold">Summarize</span> to generate insights.
        </p>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4 border-b border-white/5 pb-2">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-md font-bold text-primary mt-6 mb-2 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        {line.slice(4)}
      </h3>;
      if (line.startsWith('- [ ] ')) return (
        <div key={i} className="flex items-center gap-3 text-[14px] text-foreground/90 ml-1 my-2 group">
          <div className="h-4 w-4 rounded border border-primary/50 flex items-center justify-center transition-colors group-hover:bg-primary/10">
            <div className="h-1.5 w-1.5 rounded-sm bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {line.slice(6)}
        </div>
      );
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.*?)\*\*(.*)$/);
        if (match) return <div key={i} className="text-[14px] text-foreground/80 ml-4 my-2 flex gap-3">
          <span className="text-primary mt-1">•</span>
          <span><strong className="text-foreground font-bold">{match[1]}</strong>{match[2]}</span>
        </div>;
      }
      if (line.startsWith('- ')) return <div key={i} className="text-[14px] text-foreground/80 ml-4 my-2 flex gap-3">
        <span className="text-primary mt-1">•</span>
        <span>{line.slice(2)}</span>
      </div>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-sm font-bold text-primary/80 mt-4 uppercase tracking-widest">{line.slice(2, -2)}</p>;
      if (line.trim() === '') return <div key={i} className="h-4" />;
      return <p key={i} className="text-[14px] leading-relaxed text-foreground/80 mb-2">{line}</p>;
    });
  };

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
              <><Edit2 className="h-3.5 w-3.5 text-primary" /> Edit Summary</>
            )}
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
            onClick={() => { copyToClipboard(rec.summary!); toast.success('Summary copied'); }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-full px-4"
            onClick={() => exportAsText(rec.summary!, `${rec.name}-summary.txt`)}
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
              value={rec.summary || ''}
              onChange={(e) => updateRecording(rec.id, { summary: e.target.value })}
              className="min-h-[500px] bg-black/40 border-white/10 p-6 text-[15px] leading-relaxed rounded-2xl focus:border-primary/50 transition-all resize-none font-medium"
              placeholder="Correct the summary markdown here..."
            />
          </div>
        ) : (
          <div>{renderMarkdown(rec.summary)}</div>
        )}
      </div>
    </div>
  );
};

export default SummaryTab;
