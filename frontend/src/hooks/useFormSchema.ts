import { useState, useEffect } from 'react';
import { FormSchema } from '../types';

export const useFormSchema = () => {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch('/form-schema.json');
        if (!response.ok) {
          throw new Error('Failed to fetch schema');
        }
        const data = await response.json();
        setSchema(data);
      } catch (err: any) {
        setError(err.message || 'Error parsing schema');
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  return { schema, loading, error };
};
