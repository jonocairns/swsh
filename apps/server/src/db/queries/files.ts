import type { TFile } from '@sharkord/shared';
import { asc, eq, sum } from 'drizzle-orm';
import { db } from '..';
import { files, messageFiles } from '../schema';
import { getSettings } from './server';

const getExceedingOldFiles = async (newFileSize: number) => {
  const { storageUploadMaxFileSize } = await getSettings();

  if (newFileSize > storageUploadMaxFileSize) {
    throw new Error('File size exceeds total server storage quota');
  }

  const currentUsage = await db
    .select({
      totalSize: sum(files.size)
    })
    .from(files)
    .get();

  const currentTotalSize = Number(currentUsage?.totalSize ?? 0);
  const wouldExceedBy =
    currentTotalSize + newFileSize - storageUploadMaxFileSize;

  if (wouldExceedBy <= 0) {
    return [];
  }

  const oldFiles = await db
    .select({
      id: files.id,
      name: files.name,
      size: files.size,
      userId: files.userId,
      createdAt: files.createdAt
    })
    .from(files)
    .orderBy(asc(files.createdAt));

  const filesToDelete = [];
  let freedSpace = 0;

  for (const file of oldFiles) {
    filesToDelete.push(file);
    freedSpace += file.size;

    if (freedSpace >= wouldExceedBy) {
      break;
    }
  }

  return filesToDelete;
};

const getFilesByMessageId = async (messageId: number): Promise<TFile[]> =>
  db
    .select()
    .from(messageFiles)
    .innerJoin(files, eq(messageFiles.fileId, files.id))
    .where(eq(messageFiles.messageId, messageId))
    .all()
    .map((row) => row.files);

const getFilesByUserId = async (userId: number): Promise<TFile[]> =>
  db.select().from(files).where(eq(files.userId, userId));

const getUsedFileQuota = async (): Promise<number> => {
  const result = await db
    .select({
      usedSpace: sum(files.size)
    })
    .from(files)
    .get();

  return Number(result?.usedSpace ?? 0);
};

export {
  getExceedingOldFiles,
  getFilesByMessageId,
  getFilesByUserId,
  getUsedFileQuota
};
