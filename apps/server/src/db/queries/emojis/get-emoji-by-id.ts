import type { TJoinedEmoji } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../..';
import { emojis, files, users } from '../../schema';

const getEmojiById = async (id: number): Promise<TJoinedEmoji | undefined> => {
  const avatarFiles = alias(files, 'avatarFiles');
  const bannerFiles = alias(files, 'bannerFiles');

  const row = await db
    .select({
      emoji: emojis,
      file: files,
      user: {
        id: users.id,
        name: users.name,
        roleId: users.roleId,
        bannerColor: users.bannerColor,
        bio: users.bio,
        createdAt: users.createdAt,
        banned: users.banned,
        avatarId: users.avatarId,
        bannerId: users.bannerId
      },
      avatar: avatarFiles,
      banner: bannerFiles
    })
    .from(emojis)
    .innerJoin(files, eq(emojis.fileId, files.id))
    .innerJoin(users, eq(emojis.userId, users.id))
    .leftJoin(avatarFiles, eq(users.avatarId, avatarFiles.id))
    .leftJoin(bannerFiles, eq(users.bannerId, bannerFiles.id))
    .where(eq(emojis.id, id))
    .limit(1)
    .get();

  if (!row) return undefined;

  return {
    ...row.emoji,
    file: row.file,
    user: {
      ...row.user,
      avatar: row.avatar,
      banner: row.banner
    }
  };
};

export { getEmojiById };
