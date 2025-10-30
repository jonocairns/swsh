import { t } from '../../utils/trpc';
import { banRoute } from './ban';
import { changeAvatarRoute } from './change-avatar';
import { changeBannerRoute } from './change-banner';
import {
  onUserCreateRoute,
  onUserJoinRoute,
  onUserLeaveRoute,
  onUserUpdateRoute
} from './events';
import { getUserInfoRoute } from './get-user-info';
import { getUsersRoute } from './get-users';
import { kickRoute } from './kick';
import { unbanRoute } from './unban';
import { updateUserRoute } from './update-user';

export const usersRouter = t.router({
  changeAvatar: changeAvatarRoute,
  changeBanner: changeBannerRoute,
  update: updateUserRoute,
  getInfo: getUserInfoRoute,
  getAll: getUsersRoute,
  kick: kickRoute,
  ban: banRoute,
  unban: unbanRoute,
  onJoin: onUserJoinRoute,
  onLeave: onUserLeaveRoute,
  onUpdate: onUserUpdateRoute,
  onCreate: onUserCreateRoute
});
