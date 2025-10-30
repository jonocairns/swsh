import { DisconnectCode, Permission } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { updateUser } from '../../db/mutations/users/update-user';
import { publishUser } from '../../db/publishers';
import { protectedProcedure } from '../../utils/trpc';

const banRoute = protectedProcedure
  .input(
    z.object({
      userId: z.number(),
      reason: z.string().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.needsPermission(Permission.MANAGE_USERS);

    if (input.userId === ctx.user.id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You cannot ban yourself'
      });
    }

    const userWs = ctx.getUserWs(input.userId);

    if (userWs) {
      userWs.close(DisconnectCode.BANNED, input.reason);
    }

    await updateUser(input.userId, {
      banned: true,
      banReason: input.reason ?? null,
      bannedAt: Date.now()
    });

    publishUser(input.userId, 'update');
  });

export { banRoute };
