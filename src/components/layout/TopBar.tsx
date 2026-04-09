import { useAppStore } from '@/store/useAppStore';
import { Search, Sparkles, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TopBar = () => {
  const { searchQuery, setSearchQuery, whisperModel, ollamaModel } = useAppStore();

  const modelName = ollamaModel.includes('/') 
    ? ollamaModel.split('/').pop()?.replace(':free', '') 
    : ollamaModel;

  return (
    <header className="flex items-center gap-6 px-6 h-14 bg-black/40 backdrop-blur-xl border-b border-white/5 shrink-0 z-30">
      <div className="flex items-center gap-2 group cursor-default">
        <Sparkles className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground/80">Intelligent Workspace</span>
      </div>

      <div className="relative flex-1 max-w-md mx-auto group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search through your transcripts and insights..."
          className="h-9 pl-9 text-[11px] bg-white/5 border-white/5 focus:border-primary/30 transition-all rounded-full placeholder:text-muted-foreground/40"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">Transcription</span>
            <span className="text-[10px] font-black text-amber-soft uppercase">{whisperModel}</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">AI Analysis</span>
            <span className="text-[10px] font-black text-primary uppercase capitalize">{modelName}</span>
          </div>
        </div>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
          <Cpu className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
