import { eq } from 'drizzle-orm';
import { db } from '..';
import { emojis } from '../schema';

const emojiExists = async (name: string): Promise<boolean> => {
  const emoji = await db
    .select()
    .from(emojis)
    .where(eq(emojis.name, name))
    .limit(1)
    .get();

  return !!emoji;
};

export { emojiExists };

const getUniqueEmojiName = async (baseName: string): Promise<string> => {
  const MAX_LENGTH = 24;
  let normalizedBase = baseName.toLowerCase().replace(/\s+/g, '_');

  if (normalizedBase.length > MAX_LENGTH - 3) {
    normalizedBase = normalizedBase.substring(0, MAX_LENGTH - 3);
  }

  let emojiName = normalizedBase.substring(0, MAX_LENGTH);
  let counter = 1;

  while (await emojiExists(emojiName)) {
    const suffix = `_${counter}`;
    const maxBaseLength = MAX_LENGTH - suffix.length;
    emojiName = `${normalizedBase.substring(0, maxBaseLength)}${suffix}`;
    counter++;
  }

  return emojiName;
};

export { getUniqueEmojiName };
