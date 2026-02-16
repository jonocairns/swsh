export type TDesktopPlatform = 'windows' | 'macos' | 'linux';

export type TSupportLevel = 'supported' | 'best-effort' | 'unsupported';

export enum ScreenAudioMode {
  SYSTEM = 'system',
  APP = 'app',
  NONE = 'none'
}

export type TDesktopCapabilities = {
  platform: TDesktopPlatform;
  systemAudio: TSupportLevel;
  perAppAudio: TSupportLevel;
  notes: string[];
};

export type TDesktopShareSourceKind = 'screen' | 'window';

export type TDesktopShareSource = {
  id: string;
  name: string;
  kind: TDesktopShareSourceKind;
  thumbnailDataUrl: string;
  appIconDataUrl?: string;
};

export type TDesktopScreenShareSelection = {
  sourceId: string;
  audioMode: ScreenAudioMode;
};

export type TResolvedScreenAudioMode = {
  requestedMode: ScreenAudioMode;
  effectiveMode: ScreenAudioMode;
  warning?: string;
};

export type TDesktopBridge = {
  getServerUrl: () => Promise<string>;
  setServerUrl: (serverUrl: string) => Promise<void>;
  getCapabilities: () => Promise<TDesktopCapabilities>;
  listShareSources: () => Promise<TDesktopShareSource[]>;
  prepareScreenShare: (
    selection: TDesktopScreenShareSelection
  ) => Promise<TResolvedScreenAudioMode>;
};
