import { Link } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../../theme/ThemeProvider";

export default function Appointments() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.typography.title, { color: theme.colors.text }]}>Appointment Screen!</Text>
      <Link href={"/home"} style={[styles.button, { color: theme.colors.primary }]}>Go to Home screen</Link>
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