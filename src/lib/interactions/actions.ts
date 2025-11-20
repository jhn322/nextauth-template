'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/utils/session';
import { revalidatePath } from 'next/cache';
import { PROTECTED_PATHS } from '@/lib/constants/routes';

// **  Mark Contact as Viewed  ** //
export async function markContactAsViewed(contactId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      console.error(
        '[InteractionAction] User not authenticated to mark contact as viewed.'
      );
      return { success: false, message: 'User not authenticated.' };
    }
    const userId = session.user.id;

    if (!contactId) {
      console.warn(
        '[InteractionAction] contactId is required to mark as viewed.'
      );
      return { success: false, message: 'Contact ID is required.' };
    }

    await prisma.contactInteraction.upsert({
      where: {
        userId_contactId: {
          userId: userId,
          contactId: contactId,
        },
      },
      create: {
        userId: userId,
        contactId: contactId,
      },
      update: {},
    });

    revalidatePath(PROTECTED_PATHS.DASHBOARD_BASE);
    revalidatePath(PROTECTED_PATHS.DOCUMENTATION_BASE);
    revalidatePath(PROTECTED_PATHS.SETTINGS_BASE);

    return { success: true };
  } catch (error) {
    console.error(
      '[InteractionAction] Error marking contact as viewed:',
      error
    );
    return {
      success: false,
      message: 'Could not mark contact as viewed.',
    };
  }
}
