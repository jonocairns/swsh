import type { TFile } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { files } from '../../schema';

const getFilesByUserId = async (userId: number): Promise<TFile[]> =>
  db.select().from(files).where(eq(files.userId, userId)).all();

export { getFilesByUserId };
