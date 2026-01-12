import { useVoiceChannelExternalStreamsList } from '@/features/server/voice/hooks';
import { memo } from 'react';
import { useVoiceRefs } from './hooks/use-voice-refs';

type TExternalAudioStreamProps = {
  streamId: number;
};

const ExternalAudioStream = memo(({ streamId }: TExternalAudioStreamProps) => {
  const { externalAudioRef, hasExternalAudioStream } = useVoiceRefs(streamId);

  return (
    <>
      {hasExternalAudioStream && (
        <audio
          ref={externalAudioRef}
          className="hidden"
          autoPlay
          data-stream-id={streamId}
        />
      )}
    </>
  );
});

type TExternalAudioStreamsProps = {
  channelId: number;
};

const ExternalAudioStreams = memo(
  ({ channelId }: TExternalAudioStreamsProps) => {
    const externalStreams = useVoiceChannelExternalStreamsList(channelId);

    return externalStreams.map((stream) => (
      <ExternalAudioStream key={stream.streamId} streamId={stream.streamId} />
    ));
  }
);

export { ExternalAudioStreams };
