export interface MenuItemProps {
    title: string;
    icon: string;
    onPress: () => void;
}

export interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
    onProfile: () => void;
    onSettings: () => void;
    onLogout: () => void;
}
