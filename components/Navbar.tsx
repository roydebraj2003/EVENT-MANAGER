import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import PersonaSwitcher from './PersonaSwitcher';
import { Sparkles, CalendarPlus, Briefcase, Calendar, MessageSquare, LayoutDashboard } from 'lucide-react';

export default async function Navbar() {
  const user = await getCurrentUser();
  const isFreelancer = user?.role === 'FREELANCER';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-purple-950 to-zinc-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              OccasionHub
            </span>
            <span className="text-[10px] text-zinc-500 -mt-1 font-medium tracking-wide">
              Event Talent Marketplace
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link
            href="/freelancers"
            className="px-3 py-2 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
          >
            Find Talent
          </Link>
          <Link
            href="/categories"
            className="px-3 py-2 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
          >
            Occasion Services
          </Link>
          <Link
            href="/jobs"
            className="px-3 py-2 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-zinc-400" />
            Open Gigs
          </Link>
          <Link
            href="/events"
            className="px-3 py-2 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-zinc-400" />
            My Events
          </Link>
          <Link
            href="/bookings"
            className="px-3 py-2 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
          >
            Bookings
          </Link>
          <Link
            href="/messages"
            className="px-3 py-2 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-zinc-400" />
            Messages
          </Link>
          {isFreelancer && (
            <Link
              href="/freelancer/dashboard"
              className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              Provider Hub
            </Link>
          )}
        </nav>

        {/* Action Controls & Persona Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/events/new"
            className="hidden sm:inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition"
          >
            <CalendarPlus className="w-4 h-4" />
            Post an Event
          </Link>
          {user && <PersonaSwitcher currentEmail={user.email} />}
        </div>
      </div>
    </header>
  );
}
