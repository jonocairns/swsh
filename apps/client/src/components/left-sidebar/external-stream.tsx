import { StreamKind } from '@sharkord/shared';
import { Headphones, Router, Video } from 'lucide-react';
import { memo } from 'react';
import { Tooltip } from '../ui/tooltip';

type TExternalStreamProps = {
  type: StreamKind.EXTERNAL_AUDIO | StreamKind.EXTERNAL_VIDEO;
  name: string;
};

const ExternalStream = memo(({ name, type }: TExternalStreamProps) => {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/30 text-sm">
      <Tooltip content="External Stream">
        <Router className="h-5 w-5 text-muted-foreground opacity-60" />
      </Tooltip>

      <span className="flex-1 text-muted-foreground truncate text-xs">
        {name}
      </span>

      <div className="flex items-center gap-1 opacity-60">
        {type === StreamKind.EXTERNAL_VIDEO && (
          <>
            <Video className="h-3 w-3 text-blue-500" />
          </>
        )}
        {type === StreamKind.EXTERNAL_AUDIO && (
          <>
            <Headphones className="h-3 w-3 text-green-500" />
          </>
        )}
      </div>
    </div>
  );
});

export { ExternalStream };
