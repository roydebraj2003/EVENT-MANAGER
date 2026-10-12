'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function sendMessage(conversationId: number, messageText: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required');

  if (!messageText || !messageText.trim()) {
    throw new Error('Message cannot be empty');
  }

  // 1. Fetch conversation and verify authorized participants
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      proposal: {
        include: {
          freelancer: true,
          job: {
            include: {
              event: {
                include: { client: true },
              },
            },
          },
        },
      },
    },
  });

  if (!conv) {
    throw new Error('Conversation thread not found');
  }

  const clientId = conv.proposal.job.event.client.userId;
  const freelancerId = conv.proposal.freelancer.userId;

  // Ensure only the designated client or freelancer can participate in this thread
  if (user.id !== clientId && user.id !== freelancerId) {
    throw new Error('Unauthorized: You are not a participant in this conversation thread');
  }

  const recipientId = user.id === clientId ? freelancerId : clientId;

  // 2. Create the message explicitly isolated to this conversation
  const message = await prisma.message.create({
    data: {
      conversationId: conv.id,
      senderId: user.id,
      message: messageText.trim(),
    },
    include: {
      sender: {
        select: { fullName: true, profilePicture: true },
      },
    },
  });

  // 3. Create a notification for the recipient
  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: 'NEW_MESSAGE',
      message: `${user.fullName} sent you a message: "${messageText.trim().slice(0, 45)}..."`,
    },
  });

  revalidatePath('/messages');
  return { success: true, message };
}
