import type { PlatformAdapter } from './types';

/**
 * Electron/Node.js platform adapter — stubs for wiring up later.
 * In production, these would use:
 *   - child_process for Whisper.cpp
 *   - fs for file operations
 *   - Electron desktopCapturer / navigator.mediaDevices for mic
 */
export const desktopPlatform: PlatformAdapter = {
  async startRecording() {
    throw new Error('[desktop] Not implemented: wire up Electron mic capture');
  },
  async stopRecording() {
    throw new Error('[desktop] Not implemented: wire up Electron mic capture');
  },
  async saveFile(_path, _data) {
    throw new Error('[desktop] Not implemented: wire up Node.js fs.writeFile');
  },
  async readFile(_path) {
    throw new Error('[desktop] Not implemented: wire up Node.js fs.readFile');
  },
  async pickFile(_accept) {
    throw new Error('[desktop] Not implemented: wire up Electron dialog.showOpenDialog');
  },
  getRecordingsDir: () => './recordings',
  getTranscriptsDir: () => './transcripts',
  getSummariesDir: () => './summaries',
};
