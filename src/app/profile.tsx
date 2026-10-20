import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { getCurrentUser } from "../services/auth.service";
import type { AuthenticatedProfile } from "../services/auth.service";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<AuthenticatedProfile | null>(null);
    const [error, setError] = useState("");

    // Carga el perfil actual usando el JWT para evitar mostrar datos fijos de demostración.
    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "No se pudo cargar el perfil."));
    }, []);

    const name = user?.nombre ? `${user.nombre} ${user.apellido ?? ""}`.trim() : user?.email ?? "";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Volver" style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={styles.headerSpacer} />
            </View>
            <View style={styles.content}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{name.charAt(0).toUpperCase() || "?"}</Text></View>
                {!!error ? <Text style={styles.error}>{error}</Text> : <>
                    <Text style={styles.name}>{name || "Cargando perfil..."}</Text>
                    {!!user && <Text style={styles.email}>{user.email}</Text>}
                    {!!user?.matricula && <Text style={styles.email}>Matrícula: {user.matricula}</Text>}
                </>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { minHeight: 64, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    backButton: { width: 48 },
    back: { fontSize: 28, color: "#111827" },
    headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600", color: "#111827" },
    headerSpacer: { width: 48 },
    content: { flex: 1, alignItems: "center", padding: 24 },
    avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center", marginTop: 28, marginBottom: 16 },
    avatarText: { color: "#FFFFFF", fontSize: 38, fontWeight: "bold" },
    name: { fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 6 },
    email: { fontSize: 16, color: "#6B7280", marginTop: 4 },
    error: { color: "#DC2626", textAlign: "center" },
});


