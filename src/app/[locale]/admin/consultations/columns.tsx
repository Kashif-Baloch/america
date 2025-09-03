'use client';

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

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
  [key: string]: any;
}

export const columns: ColumnDef<Consultation>[] = [
  {
    accessorKey: "user.name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return <div>{user?.name || 'N/A'}</div>;
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original.user;
      return <div className="font-mono text-sm">{user?.email || 'N/A'}</div>;
    },
  },
  {
    accessorKey: "scheduledAt",
    header: "Scheduled At",
    cell: ({ row }) => {
      const date = new Date(row.original.scheduledAt);
      return <div>{format(date, "PPpp")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const t = useTranslations("AdminConsultations.status");
      return (
        <div className="capitalize">
          {status === 'scheduled' && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
              {t('scheduled')}
            </span>
          )}
          {status === 'completed' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              {t('completed')}
            </span>
          )}
          {status === 'cancelled' && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
              {t('cancelled')}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.original.notes;
      return <div className="max-w-xs truncate">{notes || 'N/A'}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const consultation = row.original;
      const t = useTranslations("AdminConsultations.table");
      const tSuccess = useTranslations("AdminConsultations.success");
      const tError = useTranslations("AdminConsultations.error");
      const router = useRouter();

      const handleStatusUpdate = async (status: 'completed' | 'cancelled') => {
        try {
          const response = await fetch('/api/admin/consultations', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: consultation.id,
              status,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update status');
          }

          toast.success(
            status === 'completed' 
              ? tSuccess('completed') 
              : tSuccess('cancelled')
          );
          
          // Refresh the data
          router.refresh();
        } catch (error) {
          console.error('Error updating consultation status:', error);
          toast.error(tError('updateFailed'));
        }
      };

      if (consultation.status !== 'scheduled') {
        return null;
      }

      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusUpdate('completed')}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            {t('completed')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusUpdate('cancelled')}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {t('cancel')}
          </Button>
        </div>
      );
    },
  },
];
