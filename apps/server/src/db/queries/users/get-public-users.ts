import type { TJoinedPublicUser } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../..';
import { files, users } from '../../schema';

const getPublicUsers = async (
  returnIdentity: boolean = false
): Promise<TJoinedPublicUser[]> => {
  const avatarFiles = alias(files, 'avatarFiles');
  const bannerFiles = alias(files, 'bannerFiles');

  if (returnIdentity) {
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
        createdAt: users.createdAt,
        _identity: users.identity
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
      banned: result.banned,
      avatarId: result.avatarId,
      bannerId: result.bannerId,
      avatar: result.avatar,
      banner: result.banner,
      createdAt: result.createdAt,
      _identity: result._identity
    }));
  } else {
    const results = await db
      .select({
        id: users.id,
        name: users.name,
        roleId: users.roleId,
        banned: users.banned,
        bannerColor: users.bannerColor,
        bio: users.bio,
        avatarId: users.avatarId,
        bannerId: users.bannerId,
        avatar: avatarFiles,
        banner: bannerFiles,
        createdAt: users.createdAt
      })
      .from(users)
      .leftJoin(avatarFiles, eq(users.avatarId, avatarFiles.id))
      .leftJoin(bannerFiles, eq(users.bannerId, bannerFiles.id))
      .all();

    return results.map((result) => ({
      id: result.id,
      name: result.name,
      roleId: result.roleId,
      banned: result.banned,
      bannerColor: result.bannerColor,
      bio: result.bio,
      avatarId: result.avatarId,
      bannerId: result.bannerId,
      avatar: result.avatar,
      banner: result.banner,
      createdAt: result.createdAt
    }));
  }
};

export { getPublicUsers };
