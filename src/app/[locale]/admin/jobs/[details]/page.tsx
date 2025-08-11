import React from 'react'
import DetailsPage from './client'
import { db } from '@/lib/prisma';
import NotFound from '@/app/[locale]/not-found';

const Page = async ({ params }: { params: Promise<{ details: string }> }) => {
  const { details } = await params
  const job = await db.job.findUnique({
    where: {
      id: details,
    },
    include: {
      translations: true,
    },
  });
  if (!job) {
    return <NotFound />
  }
  return (
    <DetailsPage job={job} />
  )
}

export default Page
