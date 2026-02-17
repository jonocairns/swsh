import { ScreenAudioMode } from '@/runtime/types';
import { Resolution, type TDeviceSettings, VideoCodecPreference } from '@/types';

type TLegacyDeviceSettings = Partial<TDeviceSettings> & {
  shareSystemAudio?: boolean;
};

const DEFAULT_DEVICE_SETTINGS: TDeviceSettings = {
  microphoneId: undefined,
  webcamId: undefined,
  webcamResolution: Resolution['720p'],
  webcamFramerate: 30,
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: true,
  screenAudioMode: ScreenAudioMode.SYSTEM,
  experimentalRustCapture: false,
  mirrorOwnVideo: false,
  screenResolution: Resolution['720p'],
  screenFramerate: 30,
  videoCodec: VideoCodecPreference.AUTO
};

const migrateDeviceSettings = (
  incomingSettings: TLegacyDeviceSettings | undefined
): TDeviceSettings => {
  if (!incomingSettings) {
    return DEFAULT_DEVICE_SETTINGS;
  }

  let screenAudioMode = incomingSettings.screenAudioMode;

  if (
    !screenAudioMode &&
    typeof incomingSettings.shareSystemAudio === 'boolean'
  ) {
    screenAudioMode = incomingSettings.shareSystemAudio
      ? ScreenAudioMode.SYSTEM
      : ScreenAudioMode.NONE;
  }

  return {
    ...DEFAULT_DEVICE_SETTINGS,
    ...incomingSettings,
    screenAudioMode: screenAudioMode || ScreenAudioMode.SYSTEM,
    videoCodec: Object.values(VideoCodecPreference).includes(
      incomingSettings.videoCodec as VideoCodecPreference
    )
      ? (incomingSettings.videoCodec as VideoCodecPreference)
      : VideoCodecPreference.AUTO,
    experimentalRustCapture:
      typeof incomingSettings.experimentalRustCapture === 'boolean'
        ? incomingSettings.experimentalRustCapture
        : DEFAULT_DEVICE_SETTINGS.experimentalRustCapture
  };
};

export { DEFAULT_DEVICE_SETTINGS, migrateDeviceSettings };
