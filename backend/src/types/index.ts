export interface FieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: FieldError[];
}

export interface OtpSessionData {
  aadhaar: string;
  otp: string;
  expiresAt: Date;
}
