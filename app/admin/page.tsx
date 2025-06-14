import Image from 'next/image';
import Link from 'next/link';

import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';

import AppointmentUpdates from '@/components/AppointmentUpdates'; // Client component we'll create

const Admin = async () => {
  const initialAppointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/logo.png"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        {/* This is the client component managing live updates */}
        <AppointmentUpdates initialData={initialAppointments} />
      </main>
    </div>
  );
};

export default Admin;
