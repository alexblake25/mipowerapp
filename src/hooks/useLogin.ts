import { useState } from "react";
import { LoginRequest } from "../interfaces/auth.interface";
import { loginService } from "../services/auth.service";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (data: LoginRequest): Promise<boolean> => {
        try {
            setLoading(true);
            setError("");
            const response = await loginService(data);
            if (!response.success) {
                setError(response.message);
                return false;
            }
            // El servicio conserva el JWT para las peticiones protegidas siguientes.
            return true;
        } catch {
            // Diferencia un fallo de conexión de credenciales rechazadas por el servidor.
            setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
