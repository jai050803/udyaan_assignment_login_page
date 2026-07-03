import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { panFormSchema, PanFormData } from '../../validators/pan';
import { validatePan, submitRegistration, getPinDetails } from '../../services/api';
import './StepTwo.css';

interface PanFormProps {
  sessionToken: string;
  aadhaar: string;
}

export const PanForm: React.FC<PanFormProps> = ({ sessionToken, aadhaar }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [panValidating, setPanValidating] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<PanFormData>({
    resolver: zodResolver(panFormSchema)
  });

  const pincode = watch('pincode');

  useEffect(() => {
    if (pincode?.length === 6) {
      const fetchPin = async () => {
        setPinLoading(true);
        setApiError(null);
        try {
          const res = await getPinDetails(pincode);
          if (res.data) {
            setValue('city', res.data.city, { shouldValidate: true });
            setValue('state', res.data.state, { shouldValidate: true });
          }
        } catch (err: any) {
          setApiError(err.message || 'Failed to fetch Pincode details');
          setValue('city', '');
          setValue('state', '');
        } finally {
          setPinLoading(false);
        }
      };
      fetchPin();
    }
  }, [pincode, setValue]);

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

      <Input
        label="Pincode"
        maxLength={6}
        placeholder="110001"
        error={errors.pincode?.message}
        {...register('pincode')}
      />
      {pinLoading && <p style={{ fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '10px' }}>Loading location...</p>}

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
        <Button type="submit" isLoading={isSubmitting || panValidating || pinLoading} style={{ width: '100%' }}>
          Submit Registration
        </Button>
      </div>
    </form>
  );
};
