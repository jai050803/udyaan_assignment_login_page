import React, { useEffect } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { Input } from '../ui/Input';
import { usePinLookup } from '../../hooks/usePinLookup';
import { PanFormData } from '../../validators/pan';
import './PinAutofill.css';

interface PinAutofillProps {
  control: Control<PanFormData>;
  setValue: UseFormSetValue<PanFormData>;
  error?: string;
}

export const PinAutofill: React.FC<PinAutofillProps> = ({ control, setValue, error }) => {
  return (
    <Controller
      name="pincode"
      control={control}
      render={({ field }) => (
        <PinAutofillLogic field={field} setValue={setValue} propError={error} />
      )}
    />
  );
};

const PinAutofillLogic: React.FC<{ field: any, setValue: UseFormSetValue<PanFormData>, propError?: string }> = ({ field, setValue, propError }) => {
  const { city, state, loading, error } = usePinLookup(field.value || '');

  useEffect(() => {
    if (city) setValue('city', city, { shouldValidate: true });
    if (state) setValue('state', state, { shouldValidate: true });
  }, [city, state, setValue]);

  return (
    <div className="pin-autofill-container">
      <Input
        label="Pincode"
        maxLength={6}
        placeholder="110001"
        error={propError}
        {...field}
      />
      {loading && (
        <div className="pin-loading">
          <div className="spinner"></div>
          <span>Loading location...</span>
        </div>
      )}
      {error && !loading && (
        <div className="pin-error">{error}</div>
      )}
    </div>
  );
};
