import prisma from '@/lib/prisma';
import { createEvent } from '@/app/actions/events';
import { CalendarPlus, Sparkles, MapPin, DollarSign, Calendar } from 'lucide-react';

export default async function NewEventPage() {
  const categories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-8">
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
          Occasion Planner
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Post an Event & Hire Talent
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Specify your celebration date, venue details, and needed talent roles to receive competitive bids from solo specialists and crews.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xl">
        <form action={createEvent} className="space-y-6">
          {/* 1. Basic Event Info */}
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Celebration Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Jessica & David's Vineyard Wedding"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Occasion Type *
                </label>
                <select
                  name="eventType"
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Corporate Gala">Corporate Gala</option>
                  <option value="Engagement Party">Engagement Party</option>
                  <option value="House Party">House Party / Dinner</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Festival / Community">Festival / Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Venue Name or Style
                </label>
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g. The Botanical Pavilion, Private Loft"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  City / Location
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. New York, NY"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Total Budget ($ USD)
                </label>
                <input
                  type="number"
                  name="budget"
                  placeholder="e.g. 5000"
                  step="50"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Initial Gig / Role Needed */}
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Role or Specialist Needed (Gig Posting)
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Add your primary service requirement. You can add more roles once the event is created.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Role Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    name="jobBudget"
                    placeholder="e.g. 1500"
                    step="50"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Role Description & Scope
                </label>
                <textarea
                  name="jobDescription"
                  rows={3}
                  placeholder="Detail your requirements: guest count, dietary preferences, floral color palette, crew size preference, timing..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition"
            >
              Post Occasion & Solicit Bids
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
