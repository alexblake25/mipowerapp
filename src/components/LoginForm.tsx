import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { LoginFormProps } from "../interfaces/auth.interface";

export default function LoginForm({ onLogin, loading = false, error = "" }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [dismissServerError, setDismissServerError] = useState(false);
    const submitting = useRef(false);

    // Vuelve a mostrar el error cuando el servidor devuelve uno nuevo.
    useEffect(() => { setDismissServerError(false); }, [error]);

    // Al editar, limpia el error del campo y descarta el error anterior del servidor.
    const handleEmailChange = (value: string) => {
        setEmail(value);
        setFieldErrors((current) => ({ ...current, email: "" }));
        setDismissServerError(true);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setFieldErrors((current) => ({ ...current, password: "" }));
        setDismissServerError(true);
    };

    // Valida el correo y evita iniciar varias peticiones con clics seguidos.
    const handleLogin = async () => {
        if (loading || submitting.current) return;
        const normalizedEmail = email.trim();
        const nextErrors = {
            email: !normalizedEmail
                ? "El correo es obligatorio."
                : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
                    ? ""
                    : "Ingresa un correo válido.",
            password: password ? "" : "La contraseña es obligatoria."
        };
        setFieldErrors(nextErrors);
        setDismissServerError(false);
        if (nextErrors.email || nextErrors.password) return;

        submitting.current = true;
        try {
            await onLogin(normalizedEmail, password);
        } finally {
            submitting.current = false;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo del alumno"
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={!loading}
                accessibilityLabel="Correo del alumno"
            />
            {!!fieldErrors.email && <Text style={styles.error}>{fieldErrors.email}</Text>}

            <View style={styles.passwordRow}>
                <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!passwordVisible}
                    editable={!loading}
                    accessibilityLabel="Contraseña"
                />
                <Button
                    title={passwordVisible ? "Ocultar" : "Mostrar"}
                    onPress={() => setPasswordVisible((visible) => !visible)}
                    disabled={loading}
                    accessibilityLabel={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                />
            </View>
            {!!fieldErrors.password && <Text style={styles.error}>{fieldErrors.password}</Text>}
            {/* El error de autenticación desaparece al corregir los datos. */}
            {!!error && !dismissServerError && <Text style={styles.error}>{error}</Text>}
            <Button
                title={loading ? "Validando..." : "Iniciar sesión"}
                onPress={handleLogin}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 },
    passwordRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    passwordInput: { flex: 1 },
    error: { color: "red", marginBottom: 15, textAlign: "center" }
});
