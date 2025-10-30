import type { TJoinedEmoji } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../..';
import { emojis, files, users } from '../../schema';

const getEmojis = async (): Promise<TJoinedEmoji[]> => {
  const avatarFiles = alias(files, 'avatarFiles');
  const bannerFiles = alias(files, 'bannerFiles');

  const rows = await db
    .select({
      emoji: emojis,
      file: files,
      user: {
        id: users.id,
        name: users.name,
        roleId: users.roleId,
        bannerColor: users.bannerColor,
        bio: users.bio,
        banned: users.banned,
        createdAt: users.createdAt,
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
    .leftJoin(bannerFiles, eq(users.bannerId, bannerFiles.id));

  return rows.map((row) => ({
    ...row.emoji,
    file: row.file,
    user: {
      ...row.user,
      avatar: row.avatar,
      banner: row.banner
    }
  }));
};

export { getEmojis };
