import { API_URL } from "@/constants/api";
import type { LoginRequest, LoginResponse } from "../interfaces/auth.interface";

// Conserva el JWT en memoria para incluirlo después en llamadas autenticadas.
let authToken: string | null = null;

export const loginService = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    // Envía el correo del alumno tal cual; ya no se convierte desde un usuario de demostración.
    body: JSON.stringify({ email: data.email.trim(), password: data.password }),
  });

  const result = await response.json();
  if (!response.ok) {
    return {
      success: false,
      message: result.message || result.error || "No se pudo iniciar sesión. Verifica tus credenciales.",
    };
  }

  // Guarda el token que emitió la API después de validar las credenciales.
  authToken = result.token;
  return { success: true, message: result.message || "Login correcto", token: result.token, user: result.user };
};

// Adjunta el JWT en el formato que espera el middleware Bearer del backend.
export const authenticatedFetch = (url: string, init: RequestInit = {}) => {
  if (!authToken) throw new Error("No hay una sesión autenticada.");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${authToken}`);
  return fetch(url, { ...init, headers });
};

// Revoca en el backend la sesión actual y elimina el token local.
export const logoutService = async (): Promise<void> => {
  const token = authToken;
  try {
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } finally {
    authToken = null;
  }
};
export interface AuthenticatedProfile {
  id: number;
  email: string;
  nombre: string;
  rol: "Alumno";
  kind: "student" | "user";
  apellido?: string;
  matricula?: string;
}

// Consulta el perfil del alumno autenticado mediante la ruta protegida /api/alumnos.
export const getCurrentUser = async (): Promise<AuthenticatedProfile> => {
  const response = await authenticatedFetch(`${API_URL}/alumnos`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "No se pudo consultar el perfil del usuario.");
  }
  return result.data as AuthenticatedProfile;
};
