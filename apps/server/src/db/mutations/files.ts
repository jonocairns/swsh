import type { TFile } from '@sharkord/shared';
import { desc, eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';
import { db } from '..';
import { PUBLIC_PATH } from '../../helpers/paths';
import { logger } from '../../logger';
import { files, messageFiles } from '../schema';

let fileIdMutex: Promise<void> = Promise.resolve();

const getUniqueFileId = async (): Promise<number> => {
  return new Promise((resolve) => {
    fileIdMutex = fileIdMutex.then(async () => {
      const maxId = await db
        .select()
        .from(files)
        .orderBy(desc(files.id))
        .limit(1)
        .get();

      const nextId = maxId ? maxId.id + 1 : 1;
      resolve(nextId);
    });
  });
};

const removeFile = async (fileId: number): Promise<TFile | undefined> => {
  await db.delete(messageFiles).where(eq(messageFiles.fileId, fileId));

  const removedFile = await db
    .delete(files)
    .where(eq(files.id, fileId))
    .returning()
    .get();

  if (removedFile) {
    try {
      const filePath = path.join(PUBLIC_PATH, removedFile.name);

      await fs.unlink(filePath);
    } catch (error) {
      logger.error('Error deleting file from disk:', error);
    }
  }

  return removedFile;
};

export { removeFile };

export { getUniqueFileId };
