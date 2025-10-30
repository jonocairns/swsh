import { UserStatus, type Permission, type TUser } from '@sharkord/shared';
import { initTRPC, TRPCError } from '@trpc/server';
import type WebSocket from 'ws';
import { config } from '../config';
import { logger } from '../logger';
import type { TConnectionInfo } from '../types';
import { pubsub } from './pubsub';

export type Context = {
  handshakeHash: string;
  authenticated: boolean;
  pubsub: typeof pubsub;
  user: TUser;
  userId: number;
  token: string;
  hasPermission: (
    targetPermission: Permission | Permission[]
  ) => Promise<boolean>;
  needsPermission: (
    targetPermission: Permission | Permission[]
  ) => Promise<void>;
  getOwnWs: () => WebSocket | undefined;
  getStatusById: (userId: number) => UserStatus;
  setWsUserId: (userId: number) => void;
  getUserWs: (userId: number) => WebSocket | undefined;
  getConnectionInfo: () => TConnectionInfo | undefined;
};

const t = initTRPC.context<Context>().create();

const timingMiddleware = t.middleware(async ({ path, type, next }) => {
  if (!config.server.debug) {
    return next();
  }

  const start = performance.now();
  const result = await next();
  const end = performance.now();
  const duration = end - start;

  logger.debug(`[tRPC] ${type.toUpperCase()} ${path} took ${duration}ms`);

  return result;
});

// this should be used for all queries and mutations apart from the join server one
// it prevents users that only are connected to the wss but did not join the server from accessing protected procedures
const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.authenticated) {
      throw new TRPCError({
        code: 'UNAUTHORIZED'
      });
    }

    return next();
  });

const publicProcedure = t.procedure.use(timingMiddleware);

export { protectedProcedure, publicProcedure, t };
