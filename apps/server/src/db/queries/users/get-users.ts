import type { TJoinedUser } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../..';
import { files, users } from '../../schema';

const getUsers = async (): Promise<TJoinedUser[]> => {
  const avatarFiles = alias(files, 'avatarFiles');
  const bannerFiles = alias(files, 'bannerFiles');

  const results = await db
    .select({
      id: users.id,
      name: users.name,
      roleId: users.roleId,
      bannerColor: users.bannerColor,
      bio: users.bio,
      avatarId: users.avatarId,
      bannerId: users.bannerId,
      updatedAt: users.updatedAt,
      createdAt: users.createdAt,
      identity: users.identity,
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
    .all();

  return results.map((result) => ({
    id: result.id,
    name: result.name,
    roleId: result.roleId,
    bannerColor: result.bannerColor,
    bio: result.bio,
    avatarId: result.avatarId,
    bannerId: result.bannerId,
    avatar: result.avatar,
    banner: result.banner,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    identity: result.identity,
    password: result.password,
    lastLoginAt: result.lastLoginAt,
    banned: result.banned,
    banReason: result.banReason,
    bannedAt: result.bannedAt
  }));
};

export { getUsers };
