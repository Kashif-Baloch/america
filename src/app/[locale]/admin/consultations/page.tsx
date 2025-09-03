'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useTranslations } from "next-intl";
import { getConsultations } from './actions';

interface User {
  name: string | null;
  email: string | null;
}

interface Consultation {
  id: string;
  status: string;
  scheduledAt: Date;
  notes: string | null;
  user: User;
  [key: string]: any; // For other fields we might not be using
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const t = useTranslations("AdminConsultations");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getConsultations();
        setConsultations(data);
      } catch (err) {
        console.error('Error fetching consultations:', err);
        setError(t('error.fetchFailed'));
        if (err instanceof Error && (err.message === 'Unauthorized' || err.message === 'Forbidden')) {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, t]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <DataTable 
        columns={columns} 
        data={consultations || []} 
      />
    </div>
  );
}
