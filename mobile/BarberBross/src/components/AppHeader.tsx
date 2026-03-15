import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';

export default function AppHeader() {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[{ color: colors.text }, typography.title]}>BarberBross</Text>

      <View style={styles.actions}>
        <Pressable style={styles.icon}>
          <Ionicons name={!true ? "notifications" : "notifications-outline"} size={22} color={colors.text} />
        </Pressable>

        <Pressable style={styles.icon}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    paddingVertical: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  icon: {
  },
})