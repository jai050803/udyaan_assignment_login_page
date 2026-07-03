import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substring(7);
    const errorId = `${generatedId}-error`;

    return (
      <div className={clsx('input-wrapper', className)}>
        {label && <label htmlFor={generatedId} className="input-label">{label}</label>}
        <input
          id={generatedId}
          ref={ref}
          className={clsx('input-field', { 'input-error': error })}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <span id={errorId} className="input-error-msg" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
