import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle
} from '@/components/ui/sheet';
import { setModViewOpen } from '@/features/app/actions';
import { useModViewOpen } from '@/features/app/hooks';
import { useAdminUserInfo } from '@/features/server/admin/hooks';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { ModViewContext, type TModViewContext } from './context';
import { ModViewContent } from './mod-view-content';

type TContentWrapperProps = {
  userId: number;
};

const ContentWrapper = memo(({ userId }: TContentWrapperProps) => {
  const { user, loading, refetch, logins } = useAdminUserInfo(userId);

  const contextValue = useMemo<TModViewContext>(
    () => ({ userId, user: user!, logins, refetch }),
    [userId, user, logins, refetch]
  );

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <ModViewContext.Provider value={contextValue}>
      <ModViewContent key={userId} />
    </ModViewContext.Provider>
  );
});

const ModViewSheet = memo(() => {
  const { isOpen, userId } = useModViewOpen();

  const handleClose = useCallback(() => {
    setModViewOpen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <Sheet defaultOpen={false} open={isOpen}>
      <SheetContent close={handleClose}>
        <SheetTitle className="sr-only">User Moderation Panel</SheetTitle>
        {userId && <ContentWrapper userId={userId} />}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

export { ModViewSheet };
