import { ScreenAudioMode } from '@/runtime/types';
import { describe, expect, it } from 'bun:test';
import {
  DEFAULT_DEVICE_SETTINGS,
  migrateDeviceSettings
} from '../migrate-device-settings';

describe('migrateDeviceSettings', () => {
  it('returns defaults when no saved data exists', () => {
    expect(migrateDeviceSettings(undefined)).toEqual(DEFAULT_DEVICE_SETTINGS);
  });

  it('migrates legacy shareSystemAudio=true to system mode', () => {
    const migrated = migrateDeviceSettings({
      shareSystemAudio: true
    });

    expect(migrated.screenAudioMode).toBe(ScreenAudioMode.SYSTEM);
  });

  it('migrates legacy shareSystemAudio=false to none mode', () => {
    const migrated = migrateDeviceSettings({
      shareSystemAudio: false
    });

    expect(migrated.screenAudioMode).toBe(ScreenAudioMode.NONE);
  });

  it('preserves explicit screenAudioMode values', () => {
    const migrated = migrateDeviceSettings({
      screenAudioMode: ScreenAudioMode.APP,
      shareSystemAudio: false
    });

    expect(migrated.screenAudioMode).toBe(ScreenAudioMode.APP);
  });
});
