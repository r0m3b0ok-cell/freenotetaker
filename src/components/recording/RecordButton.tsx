import { useEffect, useRef, useCallback } from 'react';
import { Mic, Square } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import Waveform from '@/components/shared/Waveform';
import { recordingStore } from '@/services/transcription';

const RecordButton = () => {
  const { isRecording, recordingSeconds, setIsRecording, setRecordingSeconds, addRecording } = useAppStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const recordingId = `rec-${Date.now()}`;
        recordingStore.set(recordingId, blob);

        const seconds = useAppStore.getState().recordingSeconds;
        addRecording({
          id: recordingId,
          name: `Recording ${new Date().toLocaleDateString()}`,
          date: new Date().toISOString(),
          duration: seconds,
          status: 'idle',
          transcript: null,
          summary: null,
          notes: '',
        });

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        useAppStore.getState().setRecordingSeconds(useAppStore.getState().recordingSeconds + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Could not access microphone. Please ensure permissions are granted.');
    }
  }, [setIsRecording, setRecordingSeconds, addRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    // Note: setRecordingSeconds(0) and addRecording are now handled in mediaRecorder.onstop
  }, [setIsRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="space-y-3 p-1">
      {isRecording ? (
        <div className="space-y-3 animate-fade-in group">
          <Waveform active />
          <div className="flex items-center justify-between px-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Recording</span>
            </span>
            <span className="text-sm font-mono font-bold text-amber-soft tabular-nums">{formatTime(recordingSeconds)}</span>
          </div>
          <Button 
            onClick={stopRecording} 
            variant="destructive" 
            className="w-full gap-2 bg-red-600/20 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all duration-300 h-10 shadow-lg shadow-red-900/10"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            <span className="font-semibold">Stop Recording</span>
          </Button>
        </div>
      ) : (
        <Button 
          onClick={startRecording} 
          className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 
            text-black font-bold h-11 shadow-lg shadow-amber-900/20 group relative overflow-hidden transition-all duration-300 active:scale-95"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Mic className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span className="relative z-10">Start Live Recording</span>
        </Button>
      )}
    </div>
  );
};

export default RecordButton;
