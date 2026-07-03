import React from 'react';
import './ProgressTracker.css';

interface ProgressTrackerProps {
  currentStep: 1 | 2;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  return (
    <div className="progress-container">
      <div className={`step ${currentStep > 1 ? 'completed' : 'active'}`}>
        <div className="circle">{currentStep > 1 ? '✓' : '1'}</div>
        <div className="label">Aadhaar Verification</div>
      </div>
      <div className={`line ${currentStep > 1 ? 'active-line' : ''}`}></div>
      <div className={`step ${currentStep === 2 ? 'active' : 'pending'}`}>
        <div className="circle">2</div>
        <div className="label">Business Details (PAN)</div>
      </div>
    </div>
  );
};
