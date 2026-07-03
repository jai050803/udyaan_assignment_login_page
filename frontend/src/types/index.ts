export interface FieldDef {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  validation: {
    required: boolean;
    pattern?: string;
    minLength?: number | null;
    maxLength?: number | null;
  };
  step: number;
}

export interface FormSchema {
  steps: {
    "1": FieldDef[];
    "2": FieldDef[];
  };
  scrapedAt: string;
}

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

export interface RegistrationData {
  aadhaar: string;
  pan: string;
  businessName: string;
  ownerName: string;
  pincode: string;
  city: string;
  state: string;
}
