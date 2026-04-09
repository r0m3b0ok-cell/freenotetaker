import { webPlatform } from './web';
import type { PlatformAdapter } from './types';

// In Electron, swap this to desktopPlatform
export const platform: PlatformAdapter = webPlatform;
export type { PlatformAdapter };
