import { TiptapInput } from '@/components/tiptap-input';
import Spinner from '@/components/ui/spinner';
import { useMessages } from '@/features/server/messages/hooks';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useUploadFiles } from '@/hooks/use-upload-files';
import { getTRPCClient } from '@/lib/trpc';
import { filesize } from 'filesize';
import { Send } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { FileCard } from './file-card';
import { MessagesGroup } from './messages-group';
import { TextSkeleton } from './text-skeleton';

type TChannelProps = {
  channelId: number;
};

const TextChannel = memo(({ channelId }: TChannelProps) => {
  const { files, removeFile, clearFiles, uploading, uploadingSize } =
    useUploadFiles();
  const { messages, hasMore, loadMore, loading, groupedMessages } =
    useMessages(channelId);
  const [newMessage, setNewMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialScroll = useRef(false);

  const onSendMessage = useCallback(async () => {
    if (!newMessage.trim() && !files.length) return;

    const trpc = getTRPCClient();

    try {
      await trpc.messages.send.mutate({
        content: newMessage,
        channelId,
        files: files.map((f) => f.id)
      });
    } catch (error) {
      const { _general } = parseTrpcErrors(error);

      toast.error(_general || 'Failed to send message');
      return;
    }

    setNewMessage('');
    clearFiles();
  }, [newMessage, channelId, files, clearFiles]);

  const onRemoveFileClick = useCallback(
    (fileId: string) => {
      removeFile(fileId);

      try {
        const trpc = getTRPCClient();

        trpc.files.deleteTemporary.mutate({ fileId });
      } catch {
        // ignore error
      }
    },
    [removeFile]
  );

  // detect scroll-to-top and load more messages
  const onScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container || loading) return;

    if (container.scrollTop <= 50 && hasMore) {
      const prevScrollHeight = container.scrollHeight;

      loadMore().then(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          newScrollHeight - prevScrollHeight + container.scrollTop;
      });
    }
  }, [loadMore, hasMore, loading]);

  // scroll to bottom on initial mount
  useEffect(() => {
    if (!containerRef.current) return;
    if (messages.length === 0) return;

    if (!hasInitialScroll.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
      hasInitialScroll.current = true;
    }
  }, [messages]);

  // auto-scroll on new messages if user is near bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) return;

    // check scroll percentage
    const scrollPosition = container.scrollTop + container.clientHeight;
    const threshold = container.scrollHeight * 0.95;

    if (scrollPosition >= threshold) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return <TextSkeleton />;
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-2 animate-in fade-in duration-500"
      >
        <div className="space-y-4">
          {groupedMessages.map((group, index) => (
            <MessagesGroup key={index} group={group} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-2">
        {uploading && (
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground mb-1">
              Uploading files ({filesize(uploadingSize)})
            </div>
            <Spinner size="xxs" />
          </div>
        )}
        {files.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {files.map((file) => (
              <FileCard
                key={file.id}
                name={file.originalName}
                extension={file.extension}
                size={file.size}
                onRemove={() => onRemoveFileClick(file.id)}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-lg">
          <TiptapInput
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={onSendMessage}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onSendMessage}
            disabled={uploading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
});

export { TextChannel };
