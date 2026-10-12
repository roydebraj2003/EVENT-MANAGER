import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                OccasionHub
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The premier marketplace connecting event hosts with trusted solo specialists and complete crews for weddings, parties, galas, and milestones.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Specialties
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/freelancers?category=Catering" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Catering & Private Chefs
                </Link>
              </li>
              <li>
                <Link href="/freelancers?category=Decoration" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Floral & Venue Decorators
                </Link>
              </li>
              <li>
                <Link href="/freelancers?category=Makeup" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Bridal & Occasion Makeup
                </Link>
              </li>
              <li>
                <Link href="/freelancers?category=Cleaning" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Pre & Post Event Cleaning Crews
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/freelancers?providerType=INDIVIDUAL" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Solo Specialists
                </Link>
              </li>
              <li>
                <Link href="/freelancers?providerType=GROUP" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Agencies & Crews (Teams)
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Open Event Gigs
                </Link>
              </li>
              <li>
                <Link href="/events/new" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Post Your Occasion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Trust & Quality
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed mb-3">
              Verified credentials, clear portfolio photos, upfront pricing, and real client reviews for complete peace of mind.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Escrow-backed milestone payments
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} OccasionHub Inc. Built for celebration memories.</p>
          <div className="flex items-center gap-1 text-xs">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for special occasions.
          </div>
        </div>
      </div>
    </footer>
  );
}
