import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ success: false, message: error.message || 'Network error' });
  }
);

export const validateAadhaar = async (aadhaar: string): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>('/aadhaar/validate', { aadhaar });
  return data;
};

export const sendOtp = async (aadhaar: string): Promise<ApiResponse<{ otp: string }>> => {
  const { data } = await api.post<ApiResponse<{ otp: string }>>('/otp/send', { aadhaar });
  return data;
};

export const verifyOtp = async (aadhaar: string, otp: string): Promise<ApiResponse<{ sessionToken: string }>> => {
  const { data } = await api.post<ApiResponse<{ sessionToken: string }>>('/otp/verify', { aadhaar, otp });
  return data;
};

export default api;
