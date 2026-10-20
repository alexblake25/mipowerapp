import { StyleSheet, Text, TouchableOpacity } from "react-native";
import type { MenuItemProps } from "../interfaces/menu.interface";

export default function MenuItem({ title, icon, onPress }: MenuItemProps) {
    return (
        <TouchableOpacity
            accessibilityRole="button"
            style={styles.container}
            onPress={onPress}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    icon: {
        fontSize: 22,
        width: 40,
    },
    title: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    arrow: {
        fontSize: 24,
        color: "#6B7280",
    },
});
