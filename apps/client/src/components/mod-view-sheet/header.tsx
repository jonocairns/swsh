import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import {
  requestConfirmation,
  requestTextInput
} from '@/features/dialogs/actions';
import { useOwnUserId, useUserStatus } from '@/features/server/users/hooks';
import { getTrpcError } from '@/helpers/parse-trpc-errors';
import { getTRPCClient } from '@/lib/trpc';
import { UserStatus } from '@sharkord/shared';
import { Gavel, Shield, UserMinus, VolumeX } from 'lucide-react';
import { memo, useCallback } from 'react';
import { toast } from 'sonner';
import { useModViewContext } from './context';

const Header = memo(() => {
  const ownUserId = useOwnUserId();
  const { user, refetch } = useModViewContext();
  const status = useUserStatus(user.id);

  const onKick = useCallback(async () => {
    const reason = await requestTextInput({
      title: 'Kick User',
      message: 'Please provide a reason for kicking this user (optional).',
      confirmLabel: 'Kick',
      allowEmpty: true
    });

    if (reason === null) {
      return;
    }

    const trpc = getTRPCClient();

    try {
      await trpc.users.kick.mutate({
        userId: user.id,
        reason
      });

      toast.success('User kicked successfully');
    } catch (error) {
      toast.error(getTrpcError(error, 'Failed to kick user'));
    } finally {
      refetch();
    }
  }, [user.id, refetch]);

  const onBan = useCallback(async () => {
    const trpc = getTRPCClient();

    const reason = await requestTextInput({
      title: 'Ban User',
      message: 'Please provide a reason for banning this user (optional).',
      confirmLabel: 'Ban',
      allowEmpty: true
    });

    if (reason === null) {
      return;
    }

    try {
      await trpc.users.ban.mutate({
        userId: user.id,
        reason
      });
      toast.success('User banned successfully');
    } catch (error) {
      toast.error(getTrpcError(error, 'Failed to ban user'));
    } finally {
      refetch();
    }
  }, [user.id, refetch]);

  const onUnban = useCallback(async () => {
    const trpc = getTRPCClient();

    const answer = await requestConfirmation({
      title: 'Unban User',
      message: 'Are you sure you want to unban this user?',
      confirmLabel: 'Unban'
    });

    if (!answer) {
      return;
    }

    try {
      await trpc.users.unban.mutate({
        userId: user.id
      });
      toast.success('User unbanned successfully');
    } catch (error) {
      toast.error(getTrpcError(error, 'Failed to unban user'));
    } finally {
      refetch();
    }
  }, [user.id, refetch]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <UserAvatar userId={user.id} className="h-12 w-12" />
        <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onKick}
          disabled={status === UserStatus.OFFLINE}
        >
          <UserMinus className="h-4 w-4" />
          Kick
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (user.banned ? onUnban() : onBan())}
          disabled={user.id === ownUserId}
        >
          <Gavel className="h-4 w-4" />
          {user.banned ? 'Unban' : 'Ban'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={status === UserStatus.OFFLINE}
        >
          <VolumeX className="h-4 w-4" />
          Timeout
        </Button>
        <Button variant="outline" size="sm">
          <Shield className="h-4 w-4" />
          Change Role
        </Button>
      </div>
    </div>
  );
});

export { Header };
