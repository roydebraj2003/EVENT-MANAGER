'use client';

import { useTransition } from 'react';
import { toggleUserStatus } from '@/app/actions/admin';
import { UserCheck, UserX, Loader2 } from 'lucide-react';

interface Props {
  userId: number;
  isActive: boolean;
}

export default function UserStatusButton({ userId, isActive }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleUserStatus(userId, !isActive);
      } catch (err: any) {
        alert(err.message || 'Error updating user status');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl transition disabled:opacity-50 ${
        isActive
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60'
          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isActive ? (
        <>
          <UserX className="w-3.5 h-3.5" /> Suspend
        </>
      ) : (
        <>
          <UserCheck className="w-3.5 h-3.5" /> Activate
        </>
      )}
    </button>
  );
}
