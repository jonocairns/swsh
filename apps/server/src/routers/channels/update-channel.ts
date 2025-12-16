import { ActivityLogType } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db';
import { publishChannel } from '../../db/publishers';
import { channels } from '../../db/schema';
import { enqueueActivityLog } from '../../queues/activity-log';
import { invariant } from '../../utils/invariant';
import { protectedProcedure } from '../../utils/trpc';

const updateChannelRoute = protectedProcedure
  .input(
    z.object({
      channelId: z.number().min(1),
      name: z.string().min(2).max(24),
      topic: z.string().max(128).nullable()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const updatedChannel = await db
      .update(channels)
      .set({
        name: input.name,
        topic: input.topic
      })
      .where(eq(channels.id, input.channelId))
      .returning()
      .get();

    invariant(updatedChannel, 'Channel not found');

    publishChannel(updatedChannel.id, 'update');
    enqueueActivityLog({
      type: ActivityLogType.UPDATED_CHANNEL,
      userId: ctx.user.id,
      details: {
        channelId: updatedChannel.id,
        values: input
      }
    });
  });

export { updateChannelRoute };
