import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { SideMenuProps } from "../interfaces/menu.interface";
import MenuItem from "./MenuItem";
import { getCurrentUser } from "../services/auth.service";
import type { AuthenticatedProfile } from "../services/auth.service";

export default function SideMenu({ visible, onClose, onProfile, onSettings, onLogout }: SideMenuProps) {
    const [user, setUser] = useState<AuthenticatedProfile | null>(null);

    // El menú obtiene del endpoint protegido los datos de la sesión actual.
    useEffect(() => {
        if (!visible) return;
        let mounted = true;
        getCurrentUser().then((profile) => { if (mounted) setUser(profile); }).catch(() => {});
        return () => { mounted = false; };
    }, [visible]);

    if (!visible) return null;

    const name = user?.nombre ? `${user.nombre} ${user.apellido ?? ""}`.trim() : user?.email ?? "";

    return (
        <View style={styles.overlay}>
            <View style={styles.menu}>
                <View style={styles.userContainer}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{name.charAt(0).toUpperCase() || "?"}</Text></View>
                    <Text style={styles.name}>{name || "Cargando perfil..."}</Text>
                    {!!user && <Text style={styles.email}>{user.email}</Text>}
                </View>
                <MenuItem title="Inicio" icon="🏠" onPress={onClose} />
                <MenuItem title="Mi Perfil" icon="👤" onPress={onProfile} />
                <MenuItem title="Configuración" icon="⚙️" onPress={onSettings} />
                <View style={styles.spacer} />
                <TouchableOpacity accessibilityRole="button" style={styles.logout} onPress={onLogout}>
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cerrar menú" style={styles.background} onPress={onClose} />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFill, flexDirection: "row", zIndex: 1000, elevation: 20 },
    menu: { width: "80%", height: "100%", backgroundColor: "#FFFFFF", paddingTop: 50, paddingBottom: 20, elevation: 10, shadowColor: "#000000", shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.25, shadowRadius: 8 },
    userContainer: { paddingHorizontal: 20, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: "#EEEEEE", alignItems: "center" },
    avatar: { width: 75, height: 75, borderRadius: 38, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center", marginBottom: 12 },
    avatarText: { color: "#FFFFFF", fontSize: 30, fontWeight: "bold" },
    name: { fontSize: 19, fontWeight: "bold", color: "#111827", marginBottom: 4 },
    email: { fontSize: 14, color: "#6B7280" },
    spacer: { flex: 1 },
    logout: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#EEEEEE" },
    logoutIcon: { fontSize: 22, width: 40 },
    logoutText: { fontSize: 16, color: "#DC2626", fontWeight: "600" },
    background: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.45)" },
});


