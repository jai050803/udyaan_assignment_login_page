import { useState, useEffect } from 'react';
import { getPinDetails } from '../services/api';

export const usePinLookup = (pincode: string) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setCity('');
      setState('');
      setDistrict('');
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await getPinDetails(pincode);
        if (res.data) {
          setCity(res.data.city);
          setState(res.data.state);
          setDistrict(res.data.district);
        }
      } catch (err: any) {
        setCity('');
        setState('');
        setDistrict('');
        setError(err.message || 'Pincode not found');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pincode]);

  return { city, state, district, loading, error };
};
