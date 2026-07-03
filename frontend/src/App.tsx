import { useState } from 'react';
import { ProgressTracker } from './components/ProgressTracker/ProgressTracker';
import { AadhaarForm } from './components/StepOne/AadhaarForm';
import { PanForm } from './components/StepTwo/PanForm';
import { useFormSchema } from './hooks/useFormSchema';
import { Layout } from './components/Layout/Layout';

function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [aadhaar, setAadhaar] = useState<string>('');

  const { schema } = useFormSchema();

  return (
    <Layout>
      <ProgressTracker currentStep={currentStep} />
      
      <div key={currentStep} className="fade-wrapper">
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
      </div>

      {schema && schema.scrapedAt && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', margin: '40px 0 20px 0' }}>
          Form schema last scraped: {new Date(schema.scrapedAt).toLocaleString()}
        </p>
      )}
    </Layout>
  );
}

export default App;
