import { Input } from '@/components/ui/input';
import type { TJoinedUser } from '@sharkord/shared';
import { Search } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { TableUser } from './table-user';

type TUsersTableProps = {
  users: TJoinedUser[];
};

const UsersTable = memo(({ users }: TUsersTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.identity?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users by name or identity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-[60px_1fr_120px_120px_120px_80px_50px] gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
          <div>Avatar</div>
          <div>Username</div>
          <div>Role</div>
          <div>Joined</div>
          <div>Last Join</div>
          <div>Status</div>
          <div></div>
        </div>

        <div className="divide-y">
          {filteredUsers.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              {searchQuery.trim()
                ? `No users found matching "${searchQuery}"`
                : 'No users found'}
            </div>
          ) : (
            filteredUsers.map((user) => <TableUser key={user.id} user={user} />)
          )}
        </div>
      </div>
    </div>
  );
});

export { UsersTable };
