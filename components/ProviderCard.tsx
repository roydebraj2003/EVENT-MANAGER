import Link from 'next/link';
import { Star, MapPin, Users, User, CheckCircle2, ArrowRight } from 'lucide-react';

export interface ProviderData {
  id: number;
  user: {
    fullName: string;
    location: string | null;
    profilePicture: string | null;
  };
  bio: string | null;
  hourlyRate: any;
  providerType: 'INDIVIDUAL' | 'GROUP';
  teamSize: number | null;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  services: Array<{
    id: number;
    price: any;
    description: string;
    category: {
      name: string;
    };
  }>;
}

interface Props {
  provider: ProviderData;
}

export default function ProviderCard({ provider }: Props) {
  const isGroup = provider.providerType === 'GROUP';
  const hourlyRate = provider.hourlyRate ? Number(provider.hourlyRate) : null;
  const startingService = provider.services.length > 0 ? Number(provider.services[0].price) : null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header with Avatar & Badge */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={provider.user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={provider.user.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-100 dark:border-zinc-800 shadow-sm"
            />
            {provider.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5 shadow-sm" title="Verified Provider">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Solo vs Group Badge */}
            <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
              {isGroup ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800">
                  <Users className="w-3 h-3 text-indigo-500" />
                  Group Crew • {provider.teamSize || 1} Members
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800">
                  <User className="w-3 h-3 text-amber-500" />
                  Solo Specialist
                </span>
              )}

              {/* Rating */}
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</span>
                {provider.totalReviews > 0 && (
                  <span className="text-[11px] text-zinc-400 font-normal">
                    ({provider.totalReviews})
                  </span>
                )}
              </div>
            </div>

            <Link href={`/freelancers/${provider.id}`}>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400 transition truncate">
                {provider.user.fullName}
              </h3>
            </Link>

            {provider.user.location && (
              <p className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0 text-zinc-400" />
                {provider.user.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 mb-4 leading-relaxed">
          {provider.bio || 'Experienced event professional dedicated to crafting memorable celebration experiences.'}
        </p>

        {/* Services tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.services.slice(0, 3).map((s) => (
            <span
              key={s.id}
              className="text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md font-medium"
            >
              {s.category.name.split('&')[0].trim()}
            </span>
          ))}
          {provider.services.length > 3 && (
            <span className="text-[11px] text-zinc-400 font-medium px-1">
              +{provider.services.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Pricing & CTA Footer */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Starting from</span>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {hourlyRate ? `$${hourlyRate}/hr` : startingService ? `$${startingService}` : 'Inquire'}
          </p>
        </div>

        <Link
          href={`/freelancers/${provider.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-purple-600 dark:hover:bg-purple-400 hover:text-white transition group-hover:translate-x-0.5"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
