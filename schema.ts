export const patientSchema = {
    userId: { type: 'string', size: 36, required: true },
    name: { type: 'string', size: 100 },
    email: { type: 'email' },
    phone: { type: 'string', size: 15 },
    birthDate: { type: 'datetime' },
    gender: { type: 'enum', options: ['male', 'female', 'other'] },
    address: { type: 'string', size: 255 },
    primaryPhysician: { type: 'string', size: 100 },
    privacyConsent: { type: 'boolean' },
  };
export const appointmentSchema = {
    name: { type: 'string', size: 100 },
    email: { type: 'email' },
    phone: { type: 'string', size: 15 },
    patient: { type: 'string', required: true }, // Store as patient document ID (relation logic is external)
    schedule: { type: 'datetime', required: true },
    status: { type: 'enum', options: ['scheduled', 'pending', 'cancelled'], required: true },
    primaryPhysician: { type: 'string', size: 128 },
    reason: { type: 'string', size: 255 },
    note: { type: 'string', size: 500 },
    userId: { type: 'string', required: true },
    //cancellationReason: { type: 'string', size: 255, required: false }
};
  