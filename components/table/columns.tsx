'use client';

import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';

import { Doctors } from '@/constants';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from '../StatusBadge';
import { Appointment } from '@/types/appwrite.types';
import { AppointmentModal } from '../AppointmentModal';

export const columns: ColumnDef<Appointment>[] = [
  {
    header: '#',
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: 'patient.name',
    header: 'Name',
    cell: ({ row }) => {
      const { name } = row.original;
      return <p className="text-14-medium">{name}</p>;
    },
  },
  {
    accessorKey: 'patient.phone',
    header: 'Phone',
    cell: ({ row }) => {
      const { phone } = row.original;
      return <p className="text-14-regular">{phone}</p>;
    },
  },
  {
    accessorKey: 'patient.email',
    header: 'Email',
    cell: ({ row }) => {
      const { email } = row.original;
      return <p className="text-14-regular">{email}</p>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: 'schedule',
    header: 'Appointment',
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: 'primaryPhysician',
    header: 'Doctor',
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
          />
        </div>
      );
    },
  },
];
