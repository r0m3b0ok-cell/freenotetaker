import type { PlatformAdapter } from './types';

/** Browser-safe mock implementation for development/preview */
export const webPlatform: PlatformAdapter = {
  async startRecording() {
    console.log('[web] Mock: startRecording');
  },
  async stopRecording() {
    return { blob: new Blob(), filename: `recording_${Date.now()}.wav` };
  },
  async saveFile(path, data) {
    console.log(`[web] Mock: saveFile to ${path}`, data);
  },
  async readFile(path) {
    console.log(`[web] Mock: readFile from ${path}`);
    return '';
  },
  async pickFile(accept) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept.join(',');
      input.onchange = () => {
        const file = input.files?.[0];
        if (file) resolve({ name: file.name, size: file.size, type: file.type });
        else resolve(null);
      };
      input.click();
    });
  },
  getRecordingsDir: () => '/recordings',
  getTranscriptsDir: () => '/transcripts',
  getSummariesDir: () => '/summaries',
};
