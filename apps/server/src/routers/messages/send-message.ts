import {
  Permission,
  ServerEvents,
  type TFile,
  type TJoinedMessage
} from '@sharkord/shared';
import { z } from 'zod';
import { db } from '../../db';
import { messageFiles, messages } from '../../db/schema';
import { enqueueProcessMetadata } from '../../queues/message-metadata';
import { fileManager } from '../../utils/file-manager';
import { protectedProcedure } from '../../utils/trpc';

const sendMessageRoute = protectedProcedure
  .input(
    z
      .object({
        content: z.string(),
        channelId: z.number(),
        files: z.array(z.string()).optional()
      })
      .required()
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.needsPermission(Permission.SEND_MESSAGES);

    const message = await db
      .insert(messages)
      .values({
        channelId: input.channelId,
        userId: ctx.userId,
        content: input.content,
        createdAt: Date.now()
      })
      .returning()
      .get();

    const files: TFile[] = [];

    if (input.files.length > 0) {
      for (const tempFileId of input.files) {
        const newFile = await fileManager.saveFile(tempFileId, ctx.userId);

        await db.insert(messageFiles).values({
          messageId: message.id,
          fileId: newFile.id,
          createdAt: Date.now()
        });

        files.push(newFile);
      }
    }

    const messageWithFiles: TJoinedMessage = {
      ...message,
      files,
      reactions: []
    };

    ctx.pubsub.publish(ServerEvents.NEW_MESSAGE, messageWithFiles);

    enqueueProcessMetadata(input.content, message.id);
  });

export { sendMessageRoute };
