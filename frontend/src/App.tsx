import { useState } from 'react';
import { ProgressTracker } from './components/ProgressTracker/ProgressTracker';

const StepOne = ({ onSuccess }: { onSuccess: (token: string) => void }) => (
  <div>
    <h2>Step One Placeholder</h2>
    <button onClick={() => onSuccess('dummy-token')}>Complete Step One</button>
  </div>
);

const StepTwo = ({ sessionToken }: { sessionToken: string }) => (
  <div>
    <h2>Step Two Placeholder</h2>
    <p>Session Token: {sessionToken}</p>
  </div>
);

function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '20px' }}>
      <ProgressTracker currentStep={currentStep} />
      
      {currentStep === 1 && (
        <StepOne 
          onSuccess={(token) => {
            setSessionToken(token);
            setCurrentStep(2);
          }} 
        />
      )}

      {currentStep === 2 && (
        <StepTwo sessionToken={sessionToken!} />
      )}
    </div>
  );
}

export default App;
