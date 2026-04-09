import type { Recording } from '@/store/useAppStore';
import { Mic, FileText, BookOpen, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusIcons: Record<Recording['status'], React.ReactNode> = {
  idle: <Mic className="h-3.5 w-3.5 text-muted-foreground/60" />,
  recording: <Mic className="h-3.5 w-3.5 text-amber-500 animate-pulse" />,
  transcribing: <FileText className="h-3.5 w-3.5 text-amber-400 animate-pulse shadow-sm shadow-amber-500/50 rounded" />,
  transcribed: <FileText className="h-3.5 w-3.5 text-amber-400" />,
  summarizing: <BookOpen className="h-3.5 w-3.5 text-amber-500 animate-pulse" />,
  summarized: <BookOpen className="h-3.5 w-3.5 text-amber-500 shadow-sm shadow-amber-500/20" />,
};

interface Props {
  recording: Recording;
  isActive: boolean;
  onClick: () => void;
}

const RecordingItem = ({ recording, isActive, onClick }: Props) => {
  const formatDuration = (s: number) => {
    if (s === 0) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-xl transition-all duration-300 group relative mb-2 overflow-hidden",
        "border border-white/5",
        isActive 
          ? "bg-primary/10 border-primary/20 amber-glow scale-[1.02]" 
          : "hover:bg-white/5 hover:border-white/10"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full my-3" />
      )}
      
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2.5">
          <div className={cn(
            "p-1.5 rounded-lg transition-colors",
            isActive ? "bg-primary/20" : "bg-white/5 group-hover:bg-white/10"
          )}>
            {statusIcons[recording.status]}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "text-sm font-bold truncate transition-colors",
              isActive ? "text-primary" : "text-foreground/90 font-semibold"
            )}>
              {recording.name}
            </h4>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-medium">
                <Calendar className="h-3 w-3 opacity-50" />
                {formatDate(recording.date)}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-medium">
                <Clock className="h-3 w-3 opacity-50" />
                {formatDuration(recording.duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {!isActive && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        </div>
      )}
    </button>
  );
};

export default RecordingItem;
