'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/table/DataTable';
import { columns } from '@/components/table/columns';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';

type AppointmentData = {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: any[];
};

interface AppointmentUpdatesProps {
  initialData: AppointmentData;
}

export default function AppointmentUpdates({ initialData }: AppointmentUpdatesProps) {
  const [appointments, setAppointments] = useState(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const updatedData = await getRecentAppointmentList();
        
        setAppointments(updatedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Network Error.');
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {error && (
        <div className="rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <section className="admin-stat">
        <StatCard
          type="appointments"
          count={appointments.scheduledCount}
          label="Scheduled appointments"
          icon={'/assets/icons/appointments.svg'}
        />
        <StatCard
          type="pending"
          count={appointments.pendingCount}
          label="Pending appointments"
          icon={'/assets/icons/pending.svg'}
        />
        <StatCard
          type="cancelled"
          count={appointments.cancelledCount}
          label="Cancelled appointments"
          icon={'/assets/icons/cancelled.svg'}
        />
      </section>

      <DataTable columns={columns} data={appointments.documents} />
    </>
  );
}
