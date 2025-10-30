import type { TILogin, TLogin } from '@sharkord/shared';
import { db } from '../..';
import { logins } from '../../schema';

const createLogin = async (
  login: Omit<TILogin, 'createdAt'>
): Promise<TLogin | undefined> =>
  db
    .insert(logins)
    .values({
      ...login,
      createdAt: Date.now()
    })
    .returning()
    .get();

export { createLogin };
