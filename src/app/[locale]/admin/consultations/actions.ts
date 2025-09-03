'use server';

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from 'next/headers';

export async function getConsultations() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }

  // Fetch consultations
  return await db.consultation.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      scheduledAt: 'desc',
    },
  });
}
