import type { TJoinedSettings } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { files, settings } from '../../schema';

const getSettings = async (): Promise<TJoinedSettings> => {
  const serverSettings = await db.select().from(settings).get()!;

  const logo = serverSettings.logoId
    ? await db
        .select()
        .from(files)
        .where(eq(files.id, serverSettings.logoId))
        .get()
    : undefined;

  return {
    ...serverSettings,
    logo: logo ?? null
  };
};

export { getSettings };
