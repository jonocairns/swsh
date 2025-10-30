import type { TJoinedUser, TLogin } from '@sharkord/shared';
import { createContext, useContext } from 'react';

type TModViewContext = {
  refetch: () => void;
  userId: number;
  user: TJoinedUser;
  logins: TLogin[];
};

const ModViewContext = createContext<TModViewContext>({
  refetch: () => {},
  userId: -1,
  logins: [],
  user: {} as TJoinedUser
});

const useModViewContext = () => useContext(ModViewContext);

export { ModViewContext, useModViewContext };
export type { TModViewContext };
