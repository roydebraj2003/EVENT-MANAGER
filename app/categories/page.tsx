import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  UtensilsCrossed,
  Sparkles,
  Smile,
  Brush,
  Camera,
  Music,
  ArrowRight,
  Layers,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  'Catering & Food Services': UtensilsCrossed,
  'Decoration & Theme Styling': Sparkles,
  'Makeup, Hair & Styling': Smile,
  'Cleaning & Venue Prep': Brush,
  'Photography & Videography': Camera,
  'Music, DJ & Entertainment': Music,
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    include: {
      subCategories: true,
      _count: {
        select: { services: true, jobPostings: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
          Occasion Specialties
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Explore Services by Celebration Need
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          From full multi-course wedding feasts and post-reception cleanup squads to intimate bridal glow trials and balloon installations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.name] || Sparkles;
          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {cat.name}
                    </h2>
                    <span className="text-xs text-zinc-400">
                      {cat._count.services} specialists registered
                    </span>
                  </div>
                </div>

                {/* Subcategories */}
                {cat.subCategories.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      Specialized Options:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/freelancers?category=${encodeURIComponent(sub.name)}`}
                          className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-purple-300 px-2.5 py-1 rounded-lg transition font-medium"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {cat._count.jobPostings} open gigs
                </span>
                <Link
                  href={`/freelancers?category=${encodeURIComponent(cat.name.split('&')[0].trim())}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                >
                  View All Talent <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
