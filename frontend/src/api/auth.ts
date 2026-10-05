import client from './client';

// These functions will be connected to the backend during integration phase.
// They are structured to match the expected backend API contracts.

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: {
    id: string;
    userId?: number;
    username: string;
    email: string;
    phoneNumber?: string;
  };
}

export const authApi = {
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    client.post('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    client.post('/auth/register', payload).then((r) => r.data),

  logout: (): Promise<void> =>
    client.post('/auth/logout').then((r) => r.data),

  me: () => client.get('/auth/me').then((r) => r.data),
};
