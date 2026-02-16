export type TDesktopPlatform = "windows" | "macos" | "linux";

export type TSupportLevel = "supported" | "best-effort" | "unsupported";

export type TScreenAudioMode = "system" | "app" | "none";

export type TShareSourceKind = "screen" | "window";

export type TShareSource = {
  id: string;
  name: string;
  kind: TShareSourceKind;
  thumbnailDataUrl: string;
  appIconDataUrl?: string;
};

export type TScreenShareSelection = {
  sourceId: string;
  audioMode: TScreenAudioMode;
};

export type TDesktopCapabilities = {
  platform: TDesktopPlatform;
  systemAudio: TSupportLevel;
  perAppAudio: TSupportLevel;
  notes: string[];
};

export type TPreparedScreenShare = {
  sourceId: string;
  audioMode: TScreenAudioMode;
};

export type TResolvedScreenAudioMode = {
  requestedMode: TScreenAudioMode;
  effectiveMode: TScreenAudioMode;
  warning?: string;
};
