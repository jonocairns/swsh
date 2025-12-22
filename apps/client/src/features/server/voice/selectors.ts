import type { IRootState } from '@/features/store';
import { createCachedSelector } from 're-reselect';

export const voiceMapSelector = (state: IRootState) => state.server.voiceMap;

export const ownVoiceStateSelector = (state: IRootState) => {
  return state.server.ownVoiceState;
};

export const pinnedCardSelector = (state: IRootState) =>
  state.server.pinnedCard;

export const voiceChannelStateSelector = createCachedSelector(
  [voiceMapSelector, (_: IRootState, channelId: number) => channelId],
  (voiceMap, channelId) => voiceMap[channelId]
)((_, channelId: number) => channelId);
