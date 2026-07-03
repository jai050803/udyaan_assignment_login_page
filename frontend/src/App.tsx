import { useState } from 'react';
import { ProgressTracker } from './components/ProgressTracker/ProgressTracker';
import { AadhaarForm } from './components/StepOne/AadhaarForm';
import { PanForm } from './components/StepTwo/PanForm';

function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [aadhaar, setAadhaar] = useState<string>('');

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '20px' }}>
      <ProgressTracker currentStep={currentStep} />
      
      {currentStep === 1 && (
        <AadhaarForm 
          onSuccess={(token, aadh) => {
            setSessionToken(token);
            setAadhaar(aadh);
            setCurrentStep(2);
          }} 
        />
      )}

      {currentStep === 2 && sessionToken && (
        <PanForm sessionToken={sessionToken} aadhaar={aadhaar} />
      )}
    </div>
  );
}

export default App;
