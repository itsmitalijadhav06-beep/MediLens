export type ParameterStatus = 'normal' | 'above' | 'below';

export interface Parameter {
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: ParameterStatus;
  explanation?: string;
}

export interface Report {
  id: number;
  reportId?: number;
  name: string;
  reportName?: string;
  date?: string;
  reportDate?: string;
  parameterCount?: number;
  statusSummary?: {
    normal: number;
    above: number;
    below: number;
  };
  aiSummary?: string;
  parameters?: Parameter[];
}

export interface User {
  id: string;
  userId?: number;
  username?: string;
  name?: string;
  email: string;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface UploadState {
  file: File | null;
  reportName: string;
  reportDate: string;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
