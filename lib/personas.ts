export interface Persona {
  email: string;
  name: string;
  role: 'CLIENT' | 'FREELANCER';
  providerType?: 'INDIVIDUAL' | 'GROUP';
  teamSize?: number;
  label: string;
  avatar: string;
}

export const PRESET_PERSONAS: Persona[] = [
  {
    email: 'sarah.jenkins@example.com',
    name: 'Sarah Jenkins',
    role: 'CLIENT',
    label: 'Host / Bride (Client)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    email: 'chloe.lin.beauty@example.com',
    name: 'Chloe Lin',
    role: 'FREELANCER',
    providerType: 'INDIVIDUAL',
    teamSize: 1,
    label: 'Solo Makeup Artist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    email: 'contact@royalfeastcaterers.com',
    name: 'Royal Feast Catering Crew',
    role: 'FREELANCER',
    providerType: 'GROUP',
    teamSize: 8,
    label: 'Catering Group (Team of 8)',
    avatar: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=100&auto=format&fit=crop&q=80',
  },
  {
    email: 'ops@sparklecleancrew.com',
    name: 'Sparkle & Polish Venue Crew',
    role: 'FREELANCER',
    providerType: 'GROUP',
    teamSize: 5,
    label: 'Cleaning Squad (Team of 5)',
    avatar: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&auto=format&fit=crop&q=80',
  },
  {
    email: 'david.kim.decor@example.com',
    name: 'David Kim',
    role: 'FREELANCER',
    providerType: 'INDIVIDUAL',
    teamSize: 1,
    label: 'Solo Floral Decorator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
];
