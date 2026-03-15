import { View, Text, StyleSheet } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../theme/ThemeProvider";

type TabItemProps = {
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  active: boolean;
};

export default function TabItem({ label, icon, active }: TabItemProps) {
  const theme = useTheme();

  return (
    <View style={styles.tabButton}>
      <FontAwesome name={icon} size={20} color={active ? theme.colors.primary : theme.colors.text} />
      <Text style={[styles.tabText, {color: active ? theme.colors.primary : theme.colors.text}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center'
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
})