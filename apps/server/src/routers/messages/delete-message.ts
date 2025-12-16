import { Permission } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db';
import { removeFile } from '../../db/mutations/files';
import { publishMessage } from '../../db/publishers';
import { getFilesByMessageId } from '../../db/queries/files/get-files-by-message-id';
import { getMessage } from '../../db/queries/messages/get-message';
import { messages } from '../../db/schema';
import { invariant } from '../../utils/invariant';
import { protectedProcedure } from '../../utils/trpc';

const deleteMessageRoute = protectedProcedure
  .input(z.object({ messageId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    const targetMessage = await getMessage(input.messageId);

    invariant(targetMessage, 'Message not found');
    invariant(
      targetMessage.userId === ctx.user.id ||
        (await ctx.hasPermission(Permission.MANAGE_MESSAGES)),
      'You do not have permission to delete this message'
    );

    const files = await getFilesByMessageId(input.messageId);

    if (files.length > 0) {
      const promises = files.map(async (file) => {
        await removeFile(file.id);
      });

      await Promise.all(promises);
    }

    await db.delete(messages).where(eq(messages.id, input.messageId));

    publishMessage(input.messageId, targetMessage.channelId, 'delete');
  });

export { deleteMessageRoute };
