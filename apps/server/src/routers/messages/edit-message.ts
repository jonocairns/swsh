import { Permission } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db';
import { publishMessage } from '../../db/publishers';
import { getRawMessage } from '../../db/queries/messages/get-raw-message';
import { messages } from '../../db/schema';
import { enqueueProcessMetadata } from '../../queues/message-metadata';
import { invariant } from '../../utils/invariant';
import { protectedProcedure } from '../../utils/trpc';

const editMessageRoute = protectedProcedure
  .input(
    z.object({
      messageId: z.number(),
      content: z.string()
    })
  )
  .mutation(async ({ input, ctx }) => {
    const message = await getRawMessage(input.messageId);

    invariant(message, 'Message not found');
    invariant(
      message.userId === ctx.user.id ||
        (await ctx.hasPermission(Permission.MANAGE_MESSAGES)),
      'You do not have permission to edit this message'
    );

    await db
      .update(messages)
      .set({
        content: input.content,
        updatedAt: Date.now()
      })
      .where(eq(messages.id, input.messageId));

    publishMessage(input.messageId, undefined, 'update');
    enqueueProcessMetadata(input.content, input.messageId);
  });

export { editMessageRoute };
