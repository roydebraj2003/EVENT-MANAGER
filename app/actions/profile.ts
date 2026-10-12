'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function updateFreelancerProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.freelancerProfile) {
    throw new Error('Must be logged in as a Freelancer/Group');
  }

  const bio = formData.get('bio') as string;
  const providerType = formData.get('providerType') as 'INDIVIDUAL' | 'GROUP';
  const teamSizeStr = formData.get('teamSize') as string;
  const hourlyRateStr = formData.get('hourlyRate') as string;
  const location = formData.get('location') as string;
  const fullName = formData.get('fullName') as string;

  const teamSize = teamSizeStr ? parseInt(teamSizeStr, 10) : 1;
  const hourlyRate = hourlyRateStr ? parseFloat(hourlyRateStr) : null;

  if (fullName || location) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: fullName || user.fullName,
        location: location || user.location,
      },
    });
  }

  await prisma.freelancerProfile.update({
    where: { id: user.freelancerProfile.id },
    data: {
      bio,
      providerType,
      teamSize: providerType === 'GROUP' ? teamSize : 1,
      hourlyRate,
    },
  });

  revalidatePath('/freelancer/dashboard');
  revalidatePath(`/freelancers/${user.freelancerProfile.id}`);
}

export async function addFreelancerService(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.freelancerProfile) {
    throw new Error('Must be logged in as a Freelancer/Group');
  }

  const categoryId = parseInt(formData.get('categoryId') as string, 10);
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string;

  await prisma.freelancerService.create({
    data: {
      freelancerId: user.freelancerProfile.id,
      categoryId,
      price,
      description,
      isActive: true,
    },
  });

  revalidatePath('/freelancer/dashboard');
  revalidatePath(`/freelancers/${user.freelancerProfile.id}`);
}
