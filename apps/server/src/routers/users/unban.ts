import { Permission } from '@sharkord/shared';
import z from 'zod';
import { updateUser } from '../../db/mutations/users/update-user';
import { publishUser } from '../../db/publishers';
import { protectedProcedure } from '../../utils/trpc';

const unbanRoute = protectedProcedure
  .input(
    z.object({
      userId: z.number()
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.needsPermission(Permission.MANAGE_USERS);

    await updateUser(input.userId, {
      banned: false,
      banReason: null
    });

    publishUser(input.userId, 'update');
  });

export { unbanRoute };
