export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthenticatedUser;
}

export interface LoginFormProps {
  // Recibe el correo del alumno y espera a que termine la autenticación.
  onLogin: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}
