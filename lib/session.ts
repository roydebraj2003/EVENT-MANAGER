import { cookies } from 'next/headers';
import prisma from './prisma';
import { Persona, PRESET_PERSONAS } from './personas';

export { type Persona, PRESET_PERSONAS };

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get('active_user_email')?.value || 'sarah.jenkins@example.com';

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      clientProfile: true,
      freelancerProfile: {
        include: {
          services: {
            include: { category: true },
          },
        },
      },
    },
  });

  if (!user) {
    // Fallback to first client if user not found
    return prisma.user.findFirst({
      where: { role: 'CLIENT' },
      include: {
        clientProfile: true,
        freelancerProfile: {
          include: {
            services: {
              include: { category: true },
            },
          },
        },
      },
    });
  }

  return user;
}
