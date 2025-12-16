import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../../db';
import { removeFile } from '../../db/mutations/files';
import { publishUser } from '../../db/publishers';
import { getUserById } from '../../db/queries/users/get-user-by-id';
import { users } from '../../db/schema';
import { fileManager } from '../../utils/file-manager';
import { protectedProcedure } from '../../utils/trpc';

const changeBannerRoute = protectedProcedure
  .input(
    z.object({
      fileId: z.string().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await getUserById(ctx.userId);

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (user.bannerId) {
      await removeFile(user.bannerId);

      await db
        .update(users)
        .set({ bannerId: null })
        .where(eq(users.id, ctx.userId));
    }

    if (input.fileId) {
      const newFile = await fileManager.saveFile(input.fileId, ctx.userId);

      await db
        .update(users)
        .set({ bannerId: newFile.id })
        .where(eq(users.id, ctx.userId));
    }

    await publishUser(ctx.userId, 'update');
  });

export { changeBannerRoute };
