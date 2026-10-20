import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import SideMenu from "../components/SideMenu";
import { getCurrentUser } from "../services/auth.service";
import type { AuthenticatedProfile } from "../services/auth.service";

export default function HomeScreen() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState<AuthenticatedProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    // Solicita únicamente la identidad asociada al JWT, no la colección de alumnos.
    useEffect(() => {
        let mounted = true;
        getCurrentUser()
            .then((profile) => { if (mounted) setUser(profile); })
            .catch((cause: unknown) => {
                if (mounted) setError(cause instanceof Error ? cause.message : "No se pudo cargar el perfil.");
            })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    const displayName = user?.nombre ? `${user.nombre} ${user.apellido ?? ""}`.trim() : user?.email ?? "";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Abrir menú" onPress={() => setMenuOpen(true)}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.greeting}>Hola, {displayName}</Text>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ver perfil" onPress={() => router.push("/profile")}>
                    <Text style={styles.profile}>👤</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Mi cuenta</Text>
                {loading && <Text style={styles.status}>Consultando tu información...</Text>}
                {!!error && <Text style={styles.error}>{error}</Text>}
                {!!user && (
                    <View style={styles.userCard}>
                        {!!user.nombre && <Text style={styles.userName}>{displayName}</Text>}
                        <Text style={styles.userEmail}>{user.email}</Text>
                        {!!user.matricula && <Text style={styles.userDetail}>Matrícula: {user.matricula}</Text>}
                    </View>
                )}
            </ScrollView>
            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                onProfile={() => { setMenuOpen(false); router.push("/profile"); }}
                onSettings={() => { setMenuOpen(false); router.push("/settings"); }}
                onLogout={() => { setMenuOpen(false); router.replace("/"); }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    menuIcon: { fontSize: 28, color: "#111827" },
    greeting: { flex: 1, marginLeft: 20, fontSize: 18, fontWeight: "600", color: "#111827" },
    profile: { fontSize: 24 },
    content: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    title: { fontSize: 30, fontWeight: "bold", color: "#111827", marginBottom: 18 },
    status: { color: "#6B7280", paddingVertical: 8 },
    error: { color: "#DC2626", paddingVertical: 8, textAlign: "center" },
    userCard: { alignSelf: "stretch", padding: 18, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10 },
    userName: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 8 },
    userEmail: { fontSize: 16, color: "#374151" },
    userDetail: { fontSize: 15, color: "#6B7280", marginTop: 8 },
});


