import React from 'react';

interface ErrorMessageProps {
  message?: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <p style={{ 
      color: 'var(--color-error)', 
      backgroundColor: 'rgba(211, 47, 47, 0.1)',
      padding: '10px 14px',
      borderRadius: 'var(--radius)',
      fontSize: '14px',
      margin: '0 0 16px 0'
    }}>
      {message}
    </p>
  );
};
