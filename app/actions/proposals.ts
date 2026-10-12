'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function submitProposal(jobId: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.freelancerProfile) {
    throw new Error('Must be logged in as a Freelancer/Group to submit proposals');
  }

  const bidAmountStr = formData.get('bidAmount') as string;
  const message = formData.get('message') as string;
  const bidAmount = parseFloat(bidAmountStr);

  const proposal = await prisma.proposal.create({
    data: {
      jobId,
      freelancerId: user.freelancerProfile.id,
      bidAmount,
      message,
      status: 'PENDING',
      conversation: {
        create: {
          messages: {
            create: {
              senderId: user.id,
              message,
            },
          },
        },
      },
    },
    include: {
      job: true,
    },
  });

  revalidatePath(`/events/${proposal.job.eventId}`);
  revalidatePath('/jobs');
  revalidatePath('/freelancer/dashboard');
  return { success: true };
}

export async function acceptProposal(proposalId: number) {
  const user = await getCurrentUser();
  if (!user || !user.clientProfile) {
    throw new Error('Must be logged in as a Client');
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: {
      job: {
        include: { event: true },
      },
    },
  });

  if (!proposal) throw new Error('Proposal not found');

  // 1. Update proposal status
  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: 'ACCEPTED' },
  });

  // 2. Update job posting status
  await prisma.jobPosting.update({
    where: { id: proposal.jobId },
    data: { status: 'FILLED' },
  });

  // 3. Create confirmed booking
  const booking = await prisma.booking.create({
    data: {
      proposalId: proposal.id,
      eventId: proposal.job.eventId,
      freelancerId: proposal.freelancerId,
      clientId: user.clientProfile.id,
      totalAmount: proposal.bidAmount,
      status: 'CONFIRMED',
      payments: {
        create: {
          amount: Number(proposal.bidAmount) * 0.3, // 30% deposit
          paymentType: 'DEPOSIT',
          paymentMethod: 'Credit Card (Escrow)',
          paymentStatus: 'COMPLETED',
          transactionId: `TXN_DEP_${Date.now()}`,
        },
      },
    },
  });

  // Add system message to the proposal conversation
  const conv = await prisma.conversation.findUnique({
    where: { proposalId: proposal.id },
  });

  if (conv) {
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId: user.id,
        message: `Proposal accepted! Booking #${booking.id} confirmed with 30% deposit held securely.`,
      },
    });
  }

  revalidatePath(`/events/${proposal.job.eventId}`);
  revalidatePath('/bookings');
  revalidatePath('/messages');
  return { success: true, bookingId: booking.id };
}

export async function rejectProposal(proposalId: number) {
  const user = await getCurrentUser();
  if (!user || !user.clientProfile) {
    throw new Error('Must be logged in as a Client');
  }

  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: 'REJECTED' },
    include: { job: true },
  });

  revalidatePath(`/events/${proposal.job.eventId}`);
  return { success: true };
}
