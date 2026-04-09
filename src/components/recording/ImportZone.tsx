import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { recordingStore } from '@/services/transcription';

const ImportZone = () => {
  const { addRecording } = useAppStore();

  const handleFile = useCallback(
    async (file: File) => {
      const recordingId = `rec-${Date.now()}`;
      recordingStore.set(recordingId, file);

      // Try to get duration if possible
      let duration = 0;
      try {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          audio.onloadedmetadata = () => {
            duration = Math.round(audio.duration);
            URL.revokeObjectURL(audio.src);
            resolve(null);
          };
          audio.onerror = () => resolve(null);
        });
      } catch (e) {
        console.error('Failed to get audio duration', e);
      }

      addRecording({
        id: recordingId,
        name: file.name,
        date: new Date().toISOString(),
        duration: duration,
        status: 'idle',
        transcript: null,
        summary: null,
        notes: '',
      });
    },
    [addRecording]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onBrowse = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp3,.wav,.m4a,.mp4';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={onBrowse}
      className="glass-card border-dashed border-white/10 p-5 text-center cursor-pointer transition-all 
        hover:border-primary/50 hover:bg-primary/5 group relative overflow-hidden active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Upload className="h-6 w-6 mx-auto text-primary/60 mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Import Audio</p>
      <p className="text-[10px] text-muted-foreground mt-1">Drop files here or click to browse</p>
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {['mp3', 'wav', 'm4a', 'mp4'].map((ext) => (
          <span key={ext} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-muted-foreground uppercase">{ext}</span>
        ))}
      </div>
    </div>
  );
};

export default ImportZone;
