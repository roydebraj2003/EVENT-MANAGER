'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEvent(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.clientProfile) {
    throw new Error('Must be logged in as a Client to create events');
  }

  const title = formData.get('title') as string;
  const eventType = formData.get('eventType') as string;
  const eventDateStr = formData.get('eventDate') as string;
  const venue = formData.get('venue') as string;
  const city = formData.get('city') as string;
  const budgetStr = formData.get('budget') as string;

  const categoryIdStr = formData.get('categoryId') as string;
  const jobDescription = formData.get('jobDescription') as string;
  const jobBudgetStr = formData.get('jobBudget') as string;

  const budget = budgetStr ? parseFloat(budgetStr) : null;
  const eventDate = new Date(eventDateStr);

  const event = await prisma.event.create({
    data: {
      clientId: user.clientProfile.id,
      title,
      eventType,
      eventDate,
      venue,
      city,
      budget,
      status: 'OPEN',
      jobPostings: categoryIdStr ? {
        create: [
          {
            categoryId: parseInt(categoryIdStr, 10),
            description: jobDescription || `Seeking specialist for ${title}`,
            budget: jobBudgetStr ? parseFloat(jobBudgetStr) : budget,
            deadline: eventDate,
            status: 'OPEN',
          },
        ],
      } : undefined,
    },
  });

  revalidatePath('/events');
  revalidatePath('/jobs');
  redirect(`/events/${event.id}`);
}

export async function addJobPosting(eventId: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.clientProfile) {
    throw new Error('Must be logged in as a Client');
  }

  const categoryId = parseInt(formData.get('categoryId') as string, 10);
  const description = formData.get('description') as string;
  const budgetStr = formData.get('budget') as string;
  const deadlineStr = formData.get('deadline') as string;

  await prisma.jobPosting.create({
    data: {
      eventId,
      categoryId,
      description,
      budget: budgetStr ? parseFloat(budgetStr) : null,
      deadline: deadlineStr ? new Date(deadlineStr) : new Date(),
      status: 'OPEN',
    },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath('/jobs');
}
