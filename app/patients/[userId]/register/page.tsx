import Image from 'next/image';
import RegisterForm from '@/components/forms/RegisterForm';

interface PageProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Register = async ({ params }: PageProps) => {
  const { userId } = await params;
  const user = { $id: userId };
  
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification | PasskeyModal */}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-a flex-col py-10">
          <Image
            src="/logo.png"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          />
          <RegisterForm user={user} />
          <p className="copyright py-12">© 2024 CarePulse</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        width={1000}
        height={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;