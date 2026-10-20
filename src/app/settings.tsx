import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Volver"
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configuración</Text>
                <View style={styles.headerSpacer} />
            </View>
            <View style={styles.content}>
                <View style={styles.options}>
                    <Text style={styles.option}>ⓘ  Información de la app</Text>
                    <Text style={styles.option}>⚙️  Preferencias</Text>
                    <Text style={styles.option}>🔔  Notificaciones</Text>
                    <Text style={styles.option}>🔒  Privacidad</Text>
                    <Text style={styles.option}>❓  Ayuda y soporte</Text>
                </View>
                <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.logout}
                    onPress={() => router.replace("/")}
                >
                    <Text style={styles.logoutText}>🚪  Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    backButton: {
        width: 48,
    },
    back: {
        fontSize: 28,
        color: "#111827",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    headerSpacer: {
        width: 48,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    options: {
        gap: 8,
    },
    option: {
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        fontSize: 16,
        color: "#111827",
    },
    logout: {
        marginTop: "auto",
        alignItems: "center",
        paddingVertical: 16,
        borderRadius: 10,
        backgroundColor: "#FEF2F2",
    },
    logoutText: {
        color: "#DC2626",
        fontSize: 16,
        fontWeight: "600",
    },
});
