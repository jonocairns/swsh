import type { IRootState } from '@/features/store';
import { createCachedSelector } from 're-reselect';

export const messagesMapSelector = (state: IRootState) =>
  state.server.messagesMap;

export const typingMapSelector = (state: IRootState) => state.server.typingMap;

export const messagesByChannelIdSelector = createCachedSelector(
  [messagesMapSelector, (_: IRootState, channelId: number) => channelId],
  (messagesMap, channelId) => messagesMap[channelId] || []
)((_, channelId: number) => channelId);
