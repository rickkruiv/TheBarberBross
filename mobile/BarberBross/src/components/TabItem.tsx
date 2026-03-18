import { View, Text, StyleSheet } from "react-native";
// import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../theme/ThemeProvider";
import Ionicons from '@expo/vector-icons/Ionicons';

type TabItemProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
};

export default function TabItem({ label, icon, active }: TabItemProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.tabButton}>
      {/* <MaterialCommunityIcons name={icon} size={26} color={active ? colors.terciary : colors.text} /> */}
      <Ionicons name={icon} size={24} color={active ? colors.terciary : colors.text} />
      <Text style={[styles.tabText, { color: active ? colors.terciary : colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center'
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
})