import { Permission } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { getLastLogins } from '../../db/queries/logins/get-last-logins';
import { getUserById } from '../../db/queries/users/get-user-by-id';
import { protectedProcedure } from '../../utils/trpc';

const getUserInfoRoute = protectedProcedure
  .input(
    z.object({
      userId: z.number()
    })
  )
  .query(async ({ ctx, input }) => {
    await ctx.needsPermission(Permission.MANAGE_USERS);

    const user = await getUserById(input.userId);

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND'
      });
    }

    const [logins] = await Promise.all([getLastLogins(user.id, 6)]);

    return { user, logins };
  });

export { getUserInfoRoute };
