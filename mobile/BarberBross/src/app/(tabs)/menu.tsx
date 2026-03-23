import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { useTheme } from "../../theme/ThemeProvider";
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

type MenuItemProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  onPress: () => void;
  isExternalLink?: boolean;
  isDestructive?: boolean;
};

export default function Menu() {
  const { colors, typography } = useTheme();

  const handleOpenTerms = () => {
    Linking.openURL('url de termos kk');
  };

  const MenuItem = ({ icon, title, onPress, isExternalLink = false, isDestructive = false }: MenuItemProps) => {
    const iconColor = isDestructive ? colors.error : colors.textSecondary;
    const textColor = isDestructive ? colors.error : colors.text;

    return (
      <TouchableOpacity
        style={[styles.menuItem, { borderBottomColor: colors.divider }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.surfaceElevated }]}>
            <Ionicons name={icon} size={22} color={iconColor} />
          </View>
          <Text style={[typography.body, { color: textColor, marginLeft: 16, fontWeight: '500' }]}>{title}</Text>
        </View>
        <Ionicons
          name={isExternalLink ? "open-outline" : "chevron-forward"}
          size={20}
          color={isDestructive ? colors.error : colors.textMuted}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* perfil */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
            <Ionicons name="person" size={40} color={colors.textSecondary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[typography.title, { color: colors.text }]}>João Silva</Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>joao.silva@example.com</Text>
          </View>
        </View>

        {/* secao */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MenuItem icon="person-outline" title="Meu acesso / informações" onPress={() => { }} />
          <MenuItem icon="settings-outline" title="Preferências" onPress={() => { }} />
          <MenuItem icon="location-outline" title="Endereço" onPress={() => { }} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MenuItem icon="heart-outline" title="Favoritos" onPress={() => { }} />
          <MenuItem icon="cube-outline" title="Pacotes" onPress={() => { }} />
          <MenuItem icon="time-outline" title="Histórico" onPress={() => { }} />
          <MenuItem icon="wallet-outline" title="Expenses (Gastos)" onPress={() => { }} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MenuItem icon="document-text-outline" title="Termos de uso" onPress={handleOpenTerms} isExternalLink={true} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 24 }]}>
          <MenuItem icon="log-out-outline" title="Sair da conta" onPress={() => { }} isDestructive={true} />
        </View>

        <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center', marginTop: 32, marginBottom: 16 }]}>
          Versão do aplicativo 1.0.0
        </Text>

      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});