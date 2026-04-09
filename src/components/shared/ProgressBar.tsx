import { useAppStore } from '@/store/useAppStore';
import { Progress } from '@/components/ui/progress';

const ChunkedProgress = () => {
  const { transcriptionProgress } = useAppStore();
  const { currentChunk, totalChunks, isActive } = transcriptionProgress;

  if (!isActive) return null;

  const pct = totalChunks > 0 ? (currentChunk / totalChunks) * 100 : 0;

  return (
    <div className="space-y-1.5 px-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Transcribing...</span>
        <span>Chunk {currentChunk} of {totalChunks}</span>
      </div>
      <Progress value={pct} className="h-2 bg-accent [&>div]:bg-amber-mid" />
    </div>
  );
};

export default ChunkedProgress;
