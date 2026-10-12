'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createDispute(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required');

  const bookingId = parseInt(formData.get('bookingId') as string, 10);
  const reason = formData.get('reason') as string;

  if (!reason || !reason.trim()) {
    throw new Error('Please describe the issue or complaint');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      client: true,
      freelancer: true,
    },
  });

  if (!booking) throw new Error('Booking not found');

  // Verify that the user is part of this booking
  const isClient = booking.client.userId === user.id;
  const isFreelancer = booking.freelancer.userId === user.id;

  if (!isClient && !isFreelancer) {
    throw new Error('You are not authorized to file a dispute on this booking');
  }

  const dispute = await prisma.dispute.create({
    data: {
      bookingId,
      raisedById: user.id,
      reason: reason.trim(),
      status: 'OPEN',
    },
  });

  revalidatePath('/bookings');
  revalidatePath('/admin/disputes');
  return { success: true, disputeId: dispute.id };
}

export async function resolveDispute(
  disputeId: number,
  actionType: 'REFUND_CLIENT' | 'RELEASE_FREELANCER' | 'CLOSE'
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      booking: {
        include: { payments: true },
      },
    },
  });

  if (!dispute) throw new Error('Dispute not found');

  if (actionType === 'REFUND_CLIENT') {
    // 1. Mark deposit as refunded
    await prisma.payment.create({
      data: {
        bookingId: dispute.bookingId,
        amount: Number(dispute.booking.totalAmount) * 0.3,
        paymentType: 'DEPOSIT',
        paymentMethod: 'Escrow Refund (UPI/Card)',
        paymentStatus: 'REFUNDED',
        transactionId: `PAY_INR_REF_${Date.now()}`,
      },
    });

    // 2. Cancel booking
    await prisma.booking.update({
      where: { id: dispute.bookingId },
      data: { status: 'CANCELLED' },
    });
  } else if (actionType === 'RELEASE_FREELANCER') {
    // Release final payment to freelancer
    await prisma.payment.create({
      data: {
        bookingId: dispute.bookingId,
        amount: Number(dispute.booking.totalAmount) * 0.7,
        paymentType: 'FINAL',
        paymentMethod: 'Escrow Payout (Admin Approved)',
        paymentStatus: 'COMPLETED',
        transactionId: `PAY_INR_ADMIN_REL_${Date.now()}`,
      },
    });

    await prisma.booking.update({
      where: { id: dispute.bookingId },
      data: { status: 'COMPLETED' },
    });
  }

  // Update dispute status
  await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: actionType === 'CLOSE' ? 'CLOSED' : 'RESOLVED',
      resolvedAt: new Date(),
    },
  });

  revalidatePath('/admin/disputes');
  revalidatePath('/bookings');
  return { success: true };
}
