import { useVoice } from '@/features/server/voice/hooks';
import { StreamKind } from '@sharkord/shared';
import { memo, useEffect, useRef } from 'react';

type TExternalAudioStreamProps = {
  streamId: number;
  stream: MediaStream;
};

const ExternalAudioStream = memo(({ stream }: TExternalAudioStreamProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { ownVoiceState } = useVoice();

  useEffect(() => {
    if (!stream || !audioRef.current) return;

    audioRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = ownVoiceState.soundMuted;
  }, [ownVoiceState.soundMuted]);

  return <audio ref={audioRef} className="hidden" autoPlay />;
});

type TExternalAudioStreamsProps = {
  channelId: number;
};

const ExternalAudioStreams = memo(
  ({ channelId }: TExternalAudioStreamsProps) => {
    const { externalStreams } = useVoice();

    return (
      <>
        {Object.entries(externalStreams)
          .filter(([, item]) => item.kind === StreamKind.EXTERNAL_AUDIO)
          .map(([streamIdStr, item]) => (
            <ExternalAudioStream
              key={streamIdStr}
              streamId={Number(streamIdStr)}
              stream={item.stream}
            />
          ))}
      </>
    );
  }
);

export { ExternalAudioStreams };
