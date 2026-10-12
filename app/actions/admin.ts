'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function toggleUserVerification(freelancerId: number, isVerified: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }

  await prisma.freelancerProfile.update({
    where: { id: freelancerId },
    data: { isVerified },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/verifications');
  revalidatePath(`/freelancers/${freelancerId}`);
  revalidatePath('/freelancers');
  return { success: true };
}

export async function deleteReview(reviewId: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { booking: true },
  });

  if (!review) throw new Error('Review not found');

  await prisma.review.delete({
    where: { id: reviewId },
  });

  // Recompute rating for the reviewee if talent
  const remainingReviews = await prisma.review.findMany({
    where: {
      revieweeId: review.revieweeId,
      reviewType: 'CLIENT_TO_FREELANCER',
    },
  });

  const avg =
    remainingReviews.length > 0
      ? remainingReviews.reduce((acc, r) => acc + r.rating, 0) / remainingReviews.length
      : 0;

  await prisma.freelancerProfile.updateMany({
    where: { userId: review.revieweeId },
    data: {
      rating: Math.round(avg * 10) / 10,
      totalReviews: remainingReviews.length,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/reviews');
  revalidatePath('/bookings');
  return { success: true };
}

export async function toggleUserStatus(userId: number, isActive: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/users');
  return { success: true };
}
