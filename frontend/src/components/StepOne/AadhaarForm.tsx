import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { aadhaarSchema, AadhaarInput } from '../../validators/aadhaar';
import { validateAadhaar, sendOtp } from '../../services/api';
import { OtpInput } from './OtpInput';
import { FieldDef } from '../../types';
import './StepOne.css';

interface AadhaarFormProps {
  onSuccess: (token: string, aadhaar: string) => void;
  schemaFields?: FieldDef[];
}

export const AadhaarForm: React.FC<AadhaarFormProps> = ({ onSuccess, schemaFields }) => {
  const [showOtp, setShowOtp] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const dynamicSchema = useMemo(() => {
    if (!schemaFields) return aadhaarSchema;
    return aadhaarSchema.superRefine((data, ctx) => {
      schemaFields.forEach(field => {
        const zKeys = Object.keys(data);
        const matchedKey = zKeys.find(k => field.name.toLowerCase().includes(k.toLowerCase()) || field.id.toLowerCase().includes(k.toLowerCase()));
        
        if (matchedKey) {
          const value = (data as any)[matchedKey];
          if (value && typeof value === 'string' && field.validation?.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [matchedKey],
                message: `Format error: Does not match dynamic schema pattern`,
              });
            }
          }
        }
      });
    });
  }, [schemaFields]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<AadhaarInput>({
    resolver: zodResolver(dynamicSchema)
  });

  const currentAadhaar = watch('aadhaar');

  const onSubmit = async (data: AadhaarInput) => {
    setApiError(null);
    try {
      await validateAadhaar(data.aadhaar);
      await sendOtp(data.aadhaar);
      setShowOtp(true);
    } catch (err: any) {
      setApiError(err.message || 'Verification failed');
    }
  };

  if (showOtp) {
    return <OtpInput aadhaar={currentAadhaar} onVerified={(token) => onSuccess(token, currentAadhaar)} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-card">
      <h2 className="step-title">Aadhaar Verification</h2>
      <p className="step-subtitle">Please enter your 12-digit Aadhaar number to proceed.</p>
      
      <ErrorMessage message={apiError} />

      <Input
        label="Aadhaar Number"
        type="tel"
        maxLength={12}
        placeholder="Enter 12-digit Aadhaar"
        error={errors.aadhaar?.message}
        {...register('aadhaar')}
      />

      <div className="otp-actions">
        <Button type="submit" isLoading={isSubmitting} style={{ width: '100%' }}>
          Get OTP
        </Button>
      </div>
    </form>
  );
};
