// components/ReCaptchaV3.tsx
'use client';

import { useEffect } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const SITE_KEY = "6LdtrWArAAAAADK0hyWUqepIEeuIueR4qhwiXteg";

export const ReCaptchaWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY} scriptProps={{ async: true, defer: true }}>
      {children}
    </GoogleReCaptchaProvider>
  );
};

export const useRecaptchaToken = (action: string) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = async (): Promise<string | null> => {
    if (!executeRecaptcha) return null;
    return await executeRecaptcha(action);
  };

  return getToken;
};
