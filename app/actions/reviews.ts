'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createReview(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required');

  const bookingId = parseInt(formData.get('bookingId') as string, 10);
  const rating = parseInt(formData.get('rating') as string, 10);
  const comment = formData.get('comment') as string;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      client: { include: { user: true } },
      freelancer: { include: { user: true } },
    },
  });

  if (!booking) throw new Error('Booking not found');

  const isClient = user.id === booking.client.user.id;
  const reviewerId = user.id;
  const revieweeId = isClient ? booking.freelancer.user.id : booking.client.user.id;
  const reviewType = isClient ? 'CLIENT_TO_FREELANCER' : 'FREELANCER_TO_CLIENT';

  await prisma.review.create({
    data: {
      bookingId,
      reviewerId,
      revieweeId,
      reviewType,
      rating,
      comment,
    },
  });

  // If reviewing freelancer, recompute their average rating
  if (isClient) {
    const allReviews = await prisma.review.findMany({
      where: {
        revieweeId: booking.freelancer.user.id,
        reviewType: 'CLIENT_TO_FREELANCER',
      },
    });

    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.freelancerProfile.update({
      where: { id: booking.freelancerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: allReviews.length,
      },
    });
  }

  revalidatePath('/bookings');
  revalidatePath(`/freelancers/${booking.freelancerId}`);
  return { success: true };
}
