'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createDirectBooking(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.clientProfile) {
    throw new Error('Must be logged in as a Client to book services');
  }

  const freelancerId = parseInt(formData.get('freelancerId') as string, 10);
  const serviceId = parseInt(formData.get('serviceId') as string, 10);
  const eventDateStr = formData.get('eventDate') as string;
  const eventTitle = (formData.get('eventTitle') as string) || 'Special Occasion';
  const notes = (formData.get('notes') as string) || 'Direct booking through marketplace.';
  const paymentMethod = (formData.get('paymentMethod') as string) || 'UPI (Google Pay)';
  const transactionId = (formData.get('transactionId') as string) || `PAY_INR_DEP_${Date.now()}`;

  const service = await prisma.freelancerService.findUnique({
    where: { id: serviceId },
    include: { freelancer: { include: { user: true } }, category: true },
  });

  if (!service) throw new Error('Service not found');

  const eventDate = new Date(eventDateStr || Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 1. Create or link event
  const event = await prisma.event.create({
    data: {
      clientId: user.clientProfile.id,
      title: eventTitle,
      eventType: 'Special Occasion',
      eventDate,
      status: 'OPEN',
    },
  });

  // 2. Create job posting
  const job = await prisma.jobPosting.create({
    data: {
      eventId: event.id,
      categoryId: service.categoryId,
      description: `${service.category.name}: ${service.description}`,
      budget: service.price,
      deadline: eventDate,
      status: 'FILLED',
    },
  });

  // 3. Create proposal
  const proposal = await prisma.proposal.create({
    data: {
      jobId: job.id,
      freelancerId: freelancerId,
      bidAmount: service.price,
      message: `Direct booking request for ${service.description}. Notes: ${notes}`,
      status: 'ACCEPTED',
      conversation: {
        create: {
          messages: {
            create: {
              senderId: user.id,
              message: `Hi ${service.freelancer.user.fullName}, I've booked your package: "${service.description}". 30% advance deposit paid via ${paymentMethod}.`,
            },
          },
        },
      },
    },
  });

  // 4. Create confirmed booking with 30% advance deposit held in escrow
  const booking = await prisma.booking.create({
    data: {
      proposalId: proposal.id,
      eventId: event.id,
      freelancerId: freelancerId,
      clientId: user.clientProfile.id,
      totalAmount: service.price,
      status: 'CONFIRMED',
      payments: {
        create: {
          amount: Number(service.price) * 0.3,
          paymentType: 'DEPOSIT',
          paymentMethod,
          paymentStatus: 'COMPLETED',
          transactionId,
        },
      },
    },
  });

  revalidatePath('/bookings');
  revalidatePath(`/freelancers/${freelancerId}`);
  return { success: true, bookingId: booking.id };
}

export async function updateBookingStatus(bookingId: number, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required');

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  if (status === 'COMPLETED') {
    // Release final 70% payment from escrow to the provider
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: Number(booking.totalAmount) * 0.7,
        paymentType: 'FINAL',
        paymentMethod: 'Escrow Payout (IMPS/NEFT)',
        paymentStatus: 'COMPLETED',
        transactionId: `PAY_INR_ESCROW_REL_${Date.now()}`,
      },
    });
  }

  revalidatePath('/bookings');
  return { success: true };
}
