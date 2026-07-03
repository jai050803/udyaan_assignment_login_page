import { useState } from 'react';
import { ProgressTracker } from './components/ProgressTracker/ProgressTracker';
import { AadhaarForm } from './components/StepOne/AadhaarForm';
import { PanForm } from './components/StepTwo/PanForm';
import { useFormSchema } from './hooks/useFormSchema';

function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [aadhaar, setAadhaar] = useState<string>('');

  const { schema } = useFormSchema();

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '20px' }}>
      <ProgressTracker currentStep={currentStep} />
      
      {currentStep === 1 && (
        <AadhaarForm 
          schemaFields={schema?.steps['1']}
          onSuccess={(token, aadh) => {
            setSessionToken(token);
            setAadhaar(aadh);
            setCurrentStep(2);
          }} 
        />
      )}

      {currentStep === 2 && sessionToken && (
        <PanForm 
          sessionToken={sessionToken} 
          aadhaar={aadhaar} 
          schemaFields={schema?.steps['2']}
        />
      )}

      {schema && schema.scrapedAt && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', margin: '40px 0 20px 0' }}>
          Form schema last scraped: {new Date(schema.scrapedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default App;
