import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  disabled, 
  isLoading, 
  className,
  ...props 
}) => {
  const isDisabled = disabled || isLoading;
  return (
    <button
      className={clsx('btn', `btn-${variant}`, className)}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
