import Queue from 'queue';
import { createLogin } from '../../db/mutations/logins/create-login';
import { logger } from '../../logger';
import type { TConnectionInfo } from '../../types';
import { getIpInfo } from '../../utils/logins';

const loginsQueue = new Queue({
  concurrency: 1,
  autostart: true,
  timeout: 3000
});

loginsQueue.autostart = true;

const enqueueLogin = (userId: number, info: TConnectionInfo | undefined) => {
  loginsQueue.push(async (callback) => {
    if (!info) {
      logger.warn('No connection info provided for login of user %d', userId);
      callback?.();
      return;
    }
    const { ip, ...rest } = info;
    const ipInfo = ip ? await getIpInfo(ip) : undefined;

    await createLogin({
      userId,
      ip,
      ...rest,
      ...ipInfo
    });

    callback?.();
  });
};

export { enqueueLogin };
