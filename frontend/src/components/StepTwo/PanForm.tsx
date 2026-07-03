import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { panFormSchema, PanFormData } from '../../validators/pan';
import { validatePan, submitRegistration } from '../../services/api';
import { PinAutofill } from './PinAutofill';
import './StepTwo.css';

interface PanFormProps {
  sessionToken: string;
  aadhaar: string;
}

export const PanForm: React.FC<PanFormProps> = ({ sessionToken, aadhaar }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [panValidating, setPanValidating] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue } = useForm<PanFormData>({
    resolver: zodResolver(panFormSchema)
  });

  const onSubmit = async (data: PanFormData) => {
    setApiError(null);
    try {
      setPanValidating(true);
      await validatePan(data.pan, sessionToken);
      setPanValidating(false);

      const res = await submitRegistration({
        ...data,
        aadhaar
      }, sessionToken);

      if (res.data?.registrationId) {
        setSuccessId(res.data.registrationId);
      }
    } catch (err: any) {
      setPanValidating(false);
      if (err.errors && Array.isArray(err.errors)) {
        setApiError(err.errors.map((e: any) => `${e.field}: ${e.message}`).join(', '));
      } else {
        setApiError(err.message || 'Registration failed');
      }
    }
  };

  if (successId) {
    return (
      <div className="success-card">
        <h2>🎉 Registration Submitted Successfully!</h2>
        <p>Your ID is: <strong>{successId}</strong></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-card">
      <h2 className="step-title">Business Details</h2>
      <p className="step-subtitle">Enter your PAN and business information.</p>

      <ErrorMessage message={apiError} />

      <Input
        label="PAN Number"
        placeholder="ABCDE1234F"
        error={errors.pan?.message}
        {...register('pan', {
          onChange: (e) => {
            e.target.value = e.target.value.toUpperCase();
          }
        })}
      />

      <Input
        label="Business Name"
        placeholder="Enter your business name"
        error={errors.businessName?.message}
        {...register('businessName')}
      />

      <Input
        label="Owner Name"
        placeholder="Enter owner name"
        error={errors.ownerName?.message}
        {...register('ownerName')}
      />

      <PinAutofill 
        control={control} 
        setValue={setValue} 
        error={errors.pincode?.message} 
      />

      <div style={{ display: 'flex', gap: '16px' }}>
        <Input
          label="City"
          readOnly
          placeholder="Auto-filled"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="State"
          readOnly
          placeholder="Auto-filled"
          error={errors.state?.message}
          {...register('state')}
        />
      </div>

      <div className="otp-actions">
        <Button type="submit" isLoading={isSubmitting || panValidating} style={{ width: '100%' }}>
          Submit Registration
        </Button>
      </div>
    </form>
  );
};
