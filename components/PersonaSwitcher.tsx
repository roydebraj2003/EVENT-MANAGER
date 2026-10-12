'use client';

import { useTransition } from 'react';
import { PRESET_PERSONAS } from '@/lib/personas';
import { switchPersona } from '@/app/actions/session';
import { Users, User, ChevronDown, Check } from 'lucide-react';

interface Props {
  currentEmail: string;
}

export default function PersonaSwitcher({ currentEmail }: Props) {
  const [isPending, startTransition] = useTransition();

  const currentPersona =
    PRESET_PERSONAS.find((p) => p.email === currentEmail) || PRESET_PERSONAS[0];

  const handleSelect = (email: string) => {
    if (email === currentEmail) return;
    startTransition(async () => {
      await switchPersona(email);
    });
  };

  return (
    <div className="relative inline-block text-left group">
      <div className="flex items-center gap-2 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-500 cursor-pointer transition">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-zinc-400 font-medium">Viewing as:</span>
        <div className="flex items-center gap-1.5 font-semibold text-zinc-100">
          {currentPersona.providerType === 'GROUP' ? (
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          ) : currentPersona.role === 'FREELANCER' ? (
            <User className="w-3.5 h-3.5 text-amber-400" />
          ) : null}
          <span>{currentPersona.name}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
            {currentPersona.providerType === 'GROUP'
              ? `Group (${currentPersona.teamSize})`
              : currentPersona.role === 'CLIENT'
              ? 'Client'
              : 'Solo'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 hidden group-hover:block transition-all">
        <div className="px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Switch Demo Persona
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {PRESET_PERSONAS.map((persona) => {
            const isSelected = persona.email === currentEmail;
            return (
              <button
                key={persona.email}
                disabled={isPending}
                onClick={() => handleSelect(persona.email)}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  isSelected ? 'bg-zinc-50 dark:bg-zinc-800/60' : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {persona.name}
                    </p>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {persona.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
