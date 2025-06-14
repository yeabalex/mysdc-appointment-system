// /app/patient/[userId]/register/page.tsx
import Image from 'next/image';
import RegisterForm from '@/components/forms/RegisterForm';
import { BASE_URL } from '@/const';

interface PageProps {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

function ForbiddenPage() {
  return (
    <div className="flex h-screen max-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
        <p className="text-lg text-gray-600 mb-6">
          Access denied. Invalid or tampered appointment link.
        </p>
        <p className="text-sm text-gray-500">
          Please use the original appointment link provided to you.
        </p>
      </div>
    </div>
  );
}

const Register = async ({ params, searchParams }: PageProps) => {
  const { userId } = await params;
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams.code;

  if (!code || typeof code !== 'string') {
    return <ForbiddenPage />;
  }

  try {
    // Call decryption API
    const res = await fetch(`${BASE_URL}/api/decode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedCode: code }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Decryption API failed:', res.status, res.statusText);
      return <ForbiddenPage />;
    }

    const { decryptedId } = await res.json();

    if (decryptedId !== userId) {
      return <ForbiddenPage />;
    }

    const user = { $id: userId };

    return (
      <div className="flex h-screen max-h-screen">
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
  } catch (error) {
    console.error('Error in Register component:', error);
    return <ForbiddenPage />;
  }
};

export default Register;