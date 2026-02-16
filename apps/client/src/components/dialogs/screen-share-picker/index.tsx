import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  ScreenAudioMode,
  type TDesktopCapabilities,
  type TDesktopScreenShareSelection,
  type TDesktopShareSource
} from '@/runtime/types';
import { memo, useEffect, useMemo, useState } from 'react';
import type { TDialogBaseProps } from '../types';

type TScreenSharePickerDialogProps = TDialogBaseProps & {
  sources: TDesktopShareSource[];
  capabilities: TDesktopCapabilities;
  defaultAudioMode: ScreenAudioMode;
  onConfirm?: (selection: TDesktopScreenShareSelection) => void;
  onCancel?: () => void;
};

const supportLabelMap = {
  supported: 'Supported',
  'best-effort': 'Best effort',
  unsupported: 'Unavailable'
} as const;

const ScreenSharePickerDialog = memo(
  ({
    isOpen,
    sources,
    capabilities,
    defaultAudioMode,
    onConfirm,
    onCancel
  }: TScreenSharePickerDialogProps) => {
    const [selectedSourceId, setSelectedSourceId] = useState(sources[0]?.id);
    const [audioMode, setAudioMode] = useState(defaultAudioMode);

    const hasSources = sources.length > 0;

    const sourceLabel = useMemo(() => {
      if (!hasSources) {
        return 'No shareable sources were found.';
      }

      return `${sources.length} source${sources.length === 1 ? '' : 's'} available`;
    }, [hasSources, sources.length]);

    const onSubmit = () => {
      if (!selectedSourceId) {
        return;
      }

      onConfirm?.({
        sourceId: selectedSourceId,
        audioMode
      });
    };

    const onCancelClick = () => {
      onCancel?.();
    };

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      setSelectedSourceId(sources[0]?.id);
      setAudioMode(defaultAudioMode);
    }, [isOpen, sources, defaultAudioMode]);

    return (
      <Dialog open={isOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Share Screen</DialogTitle>
            <DialogDescription>{sourceLabel}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">
                System Audio: {supportLabelMap[capabilities.systemAudio]}
              </Badge>
              <Badge variant="outline">
                Per-App Audio: {supportLabelMap[capabilities.perAppAudio]}
              </Badge>
              <Badge variant="outline">Platform: {capabilities.platform}</Badge>
            </div>

            {capabilities.notes.length > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                {capabilities.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Audio mode</label>
              <Select
                value={audioMode}
                onValueChange={(value) =>
                  setAudioMode(value as ScreenAudioMode)
                }
              >
                <SelectTrigger className="mt-2 w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={ScreenAudioMode.SYSTEM}>
                      System audio
                    </SelectItem>
                    <SelectItem value={ScreenAudioMode.APP}>
                      Per-app audio
                    </SelectItem>
                    <SelectItem value={ScreenAudioMode.NONE}>
                      No shared audio
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {sources.map((source) => {
                const isSelected = selectedSourceId === source.id;

                return (
                  <button
                    type="button"
                    key={source.id}
                    onClick={() => setSelectedSourceId(source.id)}
                    className={cn(
                      'text-left rounded-md border transition-colors overflow-hidden',
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border hover:border-primary/40'
                    )}
                  >
                    <img
                      src={source.thumbnailDataUrl}
                      alt={source.name}
                      className="h-36 w-full object-cover bg-muted"
                    />
                    <div className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {source.name}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {source.kind}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onCancelClick}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!hasSources || !selectedSourceId}
            >
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

export { ScreenSharePickerDialog };
