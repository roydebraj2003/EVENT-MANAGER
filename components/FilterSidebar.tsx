'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Users, User, Sparkles, Filter, X } from 'lucide-react';

interface Props {
  categories: Array<{ id: number; name: string }>;
}

export default function FilterSidebar({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentProviderType = searchParams.get('providerType') || 'ALL';
  const currentCategory = searchParams.get('category') || '';
  const currentMinRating = searchParams.get('minRating') || '';
  const currentQuery = searchParams.get('query') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/freelancers?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/freelancers');
  };

  const hasActiveFilters =
    currentProviderType !== 'ALL' || !!currentCategory || !!currentMinRating || !!currentQuery;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-600" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium transition"
          >
            <X className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Provider Type Filter */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
          Provider Type
        </label>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => updateFilter('providerType', 'ALL')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              currentProviderType === 'ALL'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> All Types
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateFilter('providerType', 'INDIVIDUAL')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              currentProviderType === 'INDIVIDUAL'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Solo Specialist
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateFilter('providerType', 'GROUP')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              currentProviderType === 'GROUP'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Groups & Crews
            </span>
          </button>
        </div>
      </div>

      {/* Specialty / Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
          Occasion Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              !currentCategory
                ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateFilter('category', cat.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium truncate transition ${
                currentCategory.toLowerCase() === cat.name.toLowerCase() ||
                cat.name.toLowerCase().includes(currentCategory.toLowerCase()) && currentCategory
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
          Rating
        </label>
        <div className="flex gap-2">
          {['', '4.5', '4.8'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => updateFilter('minRating', r)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                currentMinRating === r
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
              }`}
            >
              {r ? `${r}+ ★` : 'Any'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
