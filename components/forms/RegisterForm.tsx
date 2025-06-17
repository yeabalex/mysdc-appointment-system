'use client';

import { z } from 'zod';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Label } from '../ui/label';
import { SelectItem } from '../ui/select';
import SubmitButton from '../SubmitButton';
import { Form, FormControl } from '@/components/ui/form';
import { PatientFormValidation } from '@/lib/validation';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { registerPatient } from '@/lib/actions/patient.actions';
import CustomFormField, { FormFieldType } from '../CustomFormField';
import { Doctors, GenderOptions, PatientFormDefaultValues } from '@/constants';
import { useRecaptchaToken } from '@/components/ReCapthcaV3';

interface PrefilledData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface RegisterFormProps {
  user: User;
  prefilledData?: PrefilledData;
}

const RegisterForm = ({ user, prefilledData }: RegisterFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const getRecaptchaToken = useRecaptchaToken('register_form');

  // Create full name from first and last name if available
  const getFullName = () => {
    if (prefilledData?.firstName || prefilledData?.lastName) {
      return `${prefilledData.firstName || ''} ${prefilledData.lastName || ''}`.trim();
    }
    return '';
  };

  // Check if a field has prefilled data
  const hasPrefilledData = (fieldName: string) => {
    switch (fieldName) {
      case 'name':
        return !!(prefilledData?.firstName || prefilledData?.lastName);
      case 'email':
        return !!prefilledData?.email;
      case 'phone':
        return !!prefilledData?.phone;
      default:
        return false;
    }
  };

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: getFullName(),
      email: prefilledData?.email || '',
      phone: prefilledData?.phone || '',
    },
  });

  // Update form values when prefilledData changes
  useEffect(() => {
    if (prefilledData) {
      const fullName = getFullName();
      if (fullName) {
        form.setValue('name', fullName);
      }
      if (prefilledData.email) {
        form.setValue('email', prefilledData.email);
      }
      if (prefilledData.phone) {
        form.setValue('phone', prefilledData.phone);
      }
      // Force form to re-render with new values
      form.trigger();
    }
  }, [prefilledData, form]);

  // Get current form values to ensure they're displayed
  const formValues = form.watch();

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const recaptchaToken = await getRecaptchaToken();
      if (!recaptchaToken) {
        throw new Error('reCAPTCHA verification failed.');
      }

      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
      };

      // @ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            disabled={hasPrefilledData('name')}
            className={hasPrefilledData('name') ? 'opacity-60 pointer-events-none' : ''}
            value={formValues.name || getFullName()}
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="johndoe@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
              disabled={hasPrefilledData('email')}
              className={hasPrefilledData('email') ? 'opacity-60 pointer-events-none' : ''}
              value={formValues.email || prefilledData?.email || ''}
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone number"
              placeholder="(555) 123-4567"
              disabled={hasPrefilledData('phone')}
              className={hasPrefilledData('phone') ? 'opacity-60 pointer-events-none' : ''}
              value={formValues.phone || prefilledData?.phone || ''}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 street, New york, NY - 5101"
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;