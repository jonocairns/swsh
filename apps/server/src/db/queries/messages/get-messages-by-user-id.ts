import type { TMessage } from '@sharkord/shared';
import { desc, eq } from 'drizzle-orm';
import { db } from '../..';
import { messages } from '../../schema';

const getMessagesByUserId = async (userId: number): Promise<TMessage[]> =>
  db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(desc(messages.createdAt));

export { getMessagesByUserId };
