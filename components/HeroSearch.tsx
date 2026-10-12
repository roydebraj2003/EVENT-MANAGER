'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Users, User, Sparkles, Filter } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [providerType, setProviderType] = useState<'ALL' | 'INDIVIDUAL' | 'GROUP'>('ALL');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (providerType !== 'ALL') params.set('providerType', providerType);

    router.push(`/freelancers?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-zinc-200/80 dark:border-zinc-800">
      {/* Type Filter Buttons */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold">
        <span className="text-zinc-500 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Hiring Type:
        </span>
        <button
          type="button"
          onClick={() => setProviderType('ALL')}
          className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
            providerType === 'ALL'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> All Talent
        </button>
        <button
          type="button"
          onClick={() => setProviderType('INDIVIDUAL')}
          className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
            providerType === 'INDIVIDUAL'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Solo Specialist
        </button>
        <button
          type="button"
          onClick={() => setProviderType('GROUP')}
          className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
            providerType === 'GROUP'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Groups & Crews
        </button>
      </div>

      {/* Main Search Inputs */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Category Selector */}
        <div className="sm:col-span-5 relative">
          <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 ml-1">
            Specialty / Service
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="">All Services (Catering, Cleaning, Makeup...)</option>
            <option value="Catering">Catering & Food Services</option>
            <option value="Decoration">Decoration & Theme Styling</option>
            <option value="Makeup">Makeup, Hair & Styling</option>
            <option value="Cleaning">Cleaning & Venue Prep</option>
            <option value="Photography">Photography & Videography</option>
            <option value="Entertainment">Music, DJ & Entertainment</option>
          </select>
        </div>

        {/* Location Input */}
        <div className="sm:col-span-4 relative">
          <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 ml-1">
            City or Venue Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. New York, Brooklyn"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-3 sm:pt-5">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-98"
          >
            <Search className="w-4 h-4" />
            Find Talent
          </button>
        </div>
      </form>
    </div>
  );
}
