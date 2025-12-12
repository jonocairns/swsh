import type { IRootState } from '@/features/store';

export const voiceChannelStateSelector = (
  state: IRootState,
  channelId: number
) => {
  return state.server.voiceMap[channelId];
};

export const ownVoiceStateSelector = (state: IRootState) => {
  return state.server.ownVoiceState;
};

export const pinnedCardSelector = (state: IRootState) =>
  state.server.pinnedCard;
