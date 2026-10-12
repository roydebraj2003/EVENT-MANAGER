'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function switchPersona(email: string) {
  const cookieStore = await cookies();
  cookieStore.set('active_user_email', email, { path: '/' });
  revalidatePath('/', 'layout');
}
