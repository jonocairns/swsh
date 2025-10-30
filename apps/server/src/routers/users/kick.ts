import { DisconnectCode, Permission } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { protectedProcedure } from '../../utils/trpc';

const kickRoute = protectedProcedure
  .input(
    z.object({
      userId: z.number(),
      reason: z.string().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.needsPermission(Permission.MANAGE_USERS);

    const userWs = ctx.getUserWs(input.userId);

    if (!userWs) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User is not connected'
      });
    }

    userWs.close(DisconnectCode.KICKED, input.reason);
  });

export { kickRoute };
