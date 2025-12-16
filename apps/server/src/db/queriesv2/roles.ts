import type { TRole } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { roles } from '../schema';

const getDefaultRole = async (): Promise<TRole | undefined> =>
  db.select().from(roles).where(eq(roles.isDefault, true)).get();

export { getDefaultRole };
