import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tooltip } from '@/components/ui/tooltip';
import { UserAvatar } from '@/components/user-avatar';
import { useVoiceUsersByChannelId } from '@/features/server/hooks';
import { useOwnUserId, useUserById } from '@/features/server/users/hooks';
import {
  useVoice,
  useVoiceChannelAudioExternalStreams
} from '@/features/server/voice/hooks';
import { Headphones, Volume2, VolumeX } from 'lucide-react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

type AudioStreamControlProps = {
  userId?: number;
  streamId?: number;
  name: string;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
};

type VolumeControllerProps = {
  channelId: number;
};

type AudioStream = {
  key: string;
  userId?: number;
  streamId?: number;
  name: string;
};

const AudioStreamControl = memo(
  ({
    userId,
    streamId,
    name,
    volume,
    onVolumeChange,
    onToggleMute
  }: AudioStreamControlProps) => {
    const user = useUserById(userId || 0);
    const { getOrCreateRefs } = useVoice();
    const isMuted = volume === 0;

    const applyVolume = useCallback(
      (newVolume: number) => {
        const refs = getOrCreateRefs(userId || streamId || 0);
        const audioElement = streamId
          ? refs.externalAudioRef.current
          : refs.audioRef.current;

        if (audioElement) {
          audioElement.volume = newVolume / 100;
        }
      },
      [userId, streamId, getOrCreateRefs]
    );

    const handleVolumeChange = useCallback(
      (newVolume: number) => {
        applyVolume(newVolume);
        onVolumeChange(newVolume);
      },
      [applyVolume, onVolumeChange]
    );

    const handleToggle = useCallback(() => {
      onToggleMute();
    }, [onToggleMute]);

    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {userId && user ? (
            <UserAvatar userId={user.id} className="h-6 w-6" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Headphones className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm truncate flex-1">{name}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="h-6 w-6 p-0"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <div className="w-24">
            <Slider
              value={[volume]}
              onValueChange={(values) => handleVolumeChange(values[0] || 0)}
              min={0}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <span className="text-xs text-muted-foreground w-8 text-right">
            {volume}%
          </span>
        </div>
      </div>
    );
  }
);

const VolumeController = memo(({ channelId }: VolumeControllerProps) => {
  const voiceUsers = useVoiceUsersByChannelId(channelId);
  const externalAudioStreams = useVoiceChannelAudioExternalStreams(channelId);
  const { getOrCreateRefs } = useVoice();
  const ownUserId = useOwnUserId();
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const previousVolumesRef = useRef<Record<string, number>>({});

  const handleVolumeChange = useCallback((key: string, volume: number) => {
    setVolumes((prev) => ({
      ...prev,
      [key]: volume
    }));

    if (volume > 0) {
      previousVolumesRef.current[key] = volume;
    }
  }, []);

  const handleToggleMute = useCallback(
    (key: string, currentVolume: number) => {
      const isMuted = currentVolume === 0;
      const newVolume = isMuted ? (previousVolumesRef.current[key] ?? 100) : 0;

      if (!isMuted) {
        previousVolumesRef.current[key] = currentVolume;
      }

      setVolumes((prev) => ({
        ...prev,
        [key]: newVolume
      }));

      const isExternal = key.startsWith('external-');
      const id = parseInt(key.split('-')[1] || '0', 10);
      const refs = getOrCreateRefs(id);
      const audioElement = isExternal
        ? refs.externalAudioRef.current
        : refs.audioRef.current;

      if (audioElement) {
        audioElement.volume = newVolume / 100;
      }
    },
    [getOrCreateRefs]
  );

  const audioStreams = useMemo(() => {
    const streams: AudioStream[] = [];

    voiceUsers.forEach((voiceUser) => {
      if (voiceUser.id === ownUserId) return;

      streams.push({
        key: `user-${voiceUser.id}`,
        userId: voiceUser.id,
        name: voiceUser.name
      });
    });

    externalAudioStreams.forEach((stream) => {
      streams.push({
        key: `external-${stream.streamId}`,
        streamId: stream.streamId,
        name: stream.name || 'External Audio'
      });
    });

    return streams;
  }, [voiceUsers, externalAudioStreams, ownUserId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 transition-all duration-200 ease-in-out"
        >
          <Tooltip content="Volume Controls" asChild={false}>
            <Volume2 className="w-4 h-4" />
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Audio Controls</h4>
            <span className="text-xs text-muted-foreground">
              {audioStreams.length}{' '}
              {audioStreams.length === 1 ? 'stream' : 'streams'}
            </span>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {audioStreams.map((stream) => (
              <AudioStreamControl
                key={stream.key}
                userId={stream.userId}
                streamId={stream.streamId}
                name={stream.name}
                volume={volumes[stream.key] ?? 100}
                onVolumeChange={(vol) => handleVolumeChange(stream.key, vol)}
                onToggleMute={() =>
                  handleToggleMute(stream.key, volumes[stream.key] ?? 100)
                }
              />
            ))}
            {audioStreams.length === 0 && (
              <div className="text-sm text-muted-foreground py-4 text-center">
                No remote audio streams available.
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

export { VolumeController };
