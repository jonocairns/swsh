import { type TJoinedUser } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../..';
import { files, users } from '../../schema';

const getUserByIdentity = async (
  identity: string
): Promise<TJoinedUser | undefined> => {
  const avatarFiles = alias(files, 'avatarFiles');
  const bannerFiles = alias(files, 'bannerFiles');

  const user = await db
    .select({
      id: users.id,
      identity: users.identity,
      name: users.name,
      avatarId: users.avatarId,
      bannerId: users.bannerId,
      roleId: users.roleId,
      bio: users.bio,
      bannerColor: users.bannerColor,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      password: users.password,
      lastLoginAt: users.lastLoginAt,
      banned: users.banned,
      banReason: users.banReason,
      bannedAt: users.bannedAt,
      avatar: avatarFiles,
      banner: bannerFiles
    })
    .from(users)
    .leftJoin(avatarFiles, eq(users.avatarId, avatarFiles.id))
    .leftJoin(bannerFiles, eq(users.bannerId, bannerFiles.id))
    .where(eq(users.identity, identity))
    .get();

  if (!user) return undefined;

  return {
    ...user,
    avatar: user.avatar,
    banner: user.banner
  };
};

export { getUserByIdentity };
