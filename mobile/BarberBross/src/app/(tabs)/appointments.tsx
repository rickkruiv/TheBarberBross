import { Link } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../../theme/ThemeProvider";

export default function Appointments() {
  const { colors, typography } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.title, { color: colors.text }]}>Appointment Screen!</Text>
      <Link href={"/search"} style={[styles.button, { color: colors.primary }]}>Go to Search screen</Link>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
});