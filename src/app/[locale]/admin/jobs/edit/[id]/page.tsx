import NotFound from '@/app/[locale]/not-found';
import { db } from '@/lib/prisma';
import React from 'react'
import EditJobForm from './client';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const job = await db.job.findUnique({
        where: {
            id: id,
        },
        include: {
            translations: true,
        },
    });
    console.log(id)
    if (!job) {
        return <NotFound />
    }
    return (
        <div>
            <EditJobForm job={job} />
        </div>
    )
}

export default Page
