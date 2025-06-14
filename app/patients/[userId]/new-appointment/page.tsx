import Image from 'next/image';
import { getPatient } from '@/lib/actions/patient.actions';
import AppointmentForm from '@/components/forms/AppointmentForm';

interface PageProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewAppointment({
  params,
}: PageProps) {
  const { userId } = await params;
  const patient = await getPatient(userId);
  
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
        <Image
            src="/logo.png"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          />
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
            name={patient.name}
            email={patient.email}
            phone={patient.phone}
          />
          <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        width={1000}
        height={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}