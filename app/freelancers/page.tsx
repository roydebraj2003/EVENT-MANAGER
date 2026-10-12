import prisma from '@/lib/prisma';
import ProviderCard, { ProviderData } from '@/components/ProviderCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Users, User, Sparkles } from 'lucide-react';

interface Props {
  searchParams: Promise<{
    providerType?: string;
    category?: string;
    location?: string;
    minRating?: string;
    query?: string;
  }>;
}

export default async function FreelancersPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const providerType = resolvedParams.providerType;
  const category = resolvedParams.category;
  const location = resolvedParams.location;
  const minRating = resolvedParams.minRating ? parseFloat(resolvedParams.minRating) : undefined;
  const query = resolvedParams.query;

  // Build Prisma where filter
  const where: any = {};

  if (providerType === 'INDIVIDUAL' || providerType === 'GROUP') {
    where.providerType = providerType;
  }

  if (minRating !== undefined && !isNaN(minRating)) {
    where.rating = { gte: minRating };
  }

  if (category) {
    where.services = {
      some: {
        category: {
          name: { contains: category, mode: 'insensitive' },
        },
      },
    };
  }

  if (location || query) {
    where.AND = where.AND || [];
    if (location) {
      where.AND.push({
        user: {
          location: { contains: location, mode: 'insensitive' },
        },
      });
    }
    if (query) {
      where.AND.push({
        OR: [
          { user: { fullName: { contains: query, mode: 'insensitive' } } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      });
    }
  }

  const providers = await prisma.freelancerProfile.findMany({
    where,
    orderBy: { rating: 'desc' },
    include: {
      user: {
        select: {
          fullName: true,
          location: true,
          profilePicture: true,
        },
      },
      services: {
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Occasion Talent Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Explore Event Specialists & Crews
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {providerType === 'INDIVIDUAL'
            ? 'Displaying solo independent event artisans and specialists.'
            : providerType === 'GROUP'
            ? 'Displaying full-service event crews, squads, and agencies.'
            : 'Discover both solo craftspeople and multi-person agencies for your upcoming occasion.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 sticky top-20">
          <FilterSidebar categories={categories} />
        </div>

        {/* Providers Listing */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500">
              Showing <span className="text-zinc-900 dark:text-zinc-100 font-bold">{providers.length}</span> talent profiles
            </span>
          </div>

          {providers.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
              <Sparkles className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                No matching providers found
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Try loosening your filters or switching between Solo Specialists and Groups to explore more talent.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p as unknown as ProviderData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
