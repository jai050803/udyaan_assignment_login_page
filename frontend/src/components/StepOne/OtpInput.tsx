import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { verifyOtp, sendOtp } from '../../services/api';
import './StepOne.css';

interface OtpInputProps {
  aadhaar: string;
  onVerified: (token: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ aadhaar, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('OTP must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await verifyOtp(aadhaar, otp);
      if (res.data?.sessionToken) {
        onVerified(res.data.sessionToken);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResendLoading(true);
    setError(null);
    try {
      await sendOtp(aadhaar);
      setTimer(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const maskedAadhaar = `XXXX XXXX ${aadhaar.slice(-4)}`;

  return (
    <form onSubmit={handleVerify} className="step-card">
      <h2 className="step-title">Enter OTP</h2>
      <p className="step-subtitle">OTP sent to mobile linked with Aadhaar {maskedAadhaar}</p>
      
      <ErrorMessage message={error} />

      <Input
        label="6-Digit OTP"
        type="text"
        maxLength={6}
        pattern="[0-9]*"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        placeholder="Enter 6-digit OTP"
      />

      <div className="otp-actions">
        <Button type="submit" isLoading={loading} style={{ width: '100%' }}>
          Verify OTP
        </Button>
      </div>

      <div className="resend-container">
        {timer > 0 ? (
          <span className="timer-text">Resend OTP in {timer}s</span>
        ) : (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleResend} 
            isLoading={resendLoading}
          >
            Resend OTP
          </Button>
        )}
      </div>
    </form>
  );
};
