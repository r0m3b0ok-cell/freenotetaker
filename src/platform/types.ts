export interface PlatformAdapter {
  startRecording(): Promise<void>;
  stopRecording(): Promise<{ blob: Blob; filename: string }>;
  saveFile(path: string, data: Blob | string): Promise<void>;
  readFile(path: string): Promise<string>;
  pickFile(accept: string[]): Promise<{ name: string; size: number; type: string } | null>;
  getRecordingsDir(): string;
  getTranscriptsDir(): string;
  getSummariesDir(): string;
}
