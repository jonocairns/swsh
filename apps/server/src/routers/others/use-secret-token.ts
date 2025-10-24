import { OWNER_ROLE_ID, sha256 } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { updateUser } from '../../db/mutations/users/update-user';
import { publishUser } from '../../db/publishers';
import { getSettings } from '../../db/queries/others/get-settings';
import { protectedProcedure } from '../../utils/trpc';

const useSecretTokenRoute = protectedProcedure
  .input(
    z.object({
      token: z.string()
    })
  )
  .mutation(async ({ input, ctx }) => {
    const settings = await getSettings();
    const hashedToken = await sha256(input.token);

    if (hashedToken !== settings.secretToken) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid secret token'
      });
    }

    await updateUser(ctx.userId, {
      roleId: OWNER_ROLE_ID
    });

    await publishUser(ctx.userId, 'update');
  });

export { useSecretTokenRoute };
