import { type TJoinedPublicUser } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../..';
import { files, users } from '../../schema';

const getPublicUserById = async (
  userId: number
): Promise<TJoinedPublicUser | undefined> => {
  const avatarFiles = alias(files, 'avatarFiles');
  const bannerFiles = alias(files, 'bannerFiles');

  const results = await db
    .select({
      id: users.id,
      name: users.name,
      roleId: users.roleId,
      bannerColor: users.bannerColor,
      bio: users.bio,
      banned: users.banned,
      avatarId: users.avatarId,
      bannerId: users.bannerId,
      avatar: avatarFiles,
      banner: bannerFiles,
      createdAt: users.createdAt
    })
    .from(users)
    .leftJoin(avatarFiles, eq(users.avatarId, avatarFiles.id))
    .leftJoin(bannerFiles, eq(users.bannerId, bannerFiles.id))
    .where(eq(users.id, userId))
    .get();

  if (!results) return undefined;

  return {
    id: results.id,
    name: results.name,
    roleId: results.roleId,
    bannerColor: results.bannerColor,
    bio: results.bio,
    avatarId: results.avatarId,
    bannerId: results.bannerId,
    avatar: results.avatar,
    banner: results.banner,
    createdAt: results.createdAt,
    banned: results.banned
  };
};

export { getPublicUserById };
