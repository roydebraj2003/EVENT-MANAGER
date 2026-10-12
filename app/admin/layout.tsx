import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import PersonaSwitcher from '@/components/PersonaSwitcher';
import {
  LayoutDashboard,
  AlertTriangle,
  CheckCircle2,
  Star,
  Users,
  Shield,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-zinc-100/60 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">
                SaaS Console
              </span>
              <h2 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                Platform Admin
              </h2>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-600" />
              Overview & Analytics
            </Link>

            <Link
              href="/admin/disputes"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Complaints & Disputes
            </Link>

            <Link
              href="/admin/verifications"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Talent Verifications
            </Link>

            <Link
              href="/admin/reviews"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Star className="w-4 h-4 text-amber-500" />
              Review Moderation
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Users className="w-4 h-4 text-indigo-500" />
              User Directory
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Exit to Marketplace
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 p-6 sm:p-10 max-w-6xl w-full">
        {!isAdmin && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                You are currently viewing as <strong>{user?.fullName || 'Guest'}</strong> ({user?.role}). Use the persona switcher above to switch to <strong>Rajesh Sharma (Admin)</strong> for full administrative clearance.
              </span>
            </div>
            {user && <PersonaSwitcher currentEmail={user.email} />}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
