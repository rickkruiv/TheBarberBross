import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../../theme/ThemeProvider";
import { useEffect } from 'react';

export default function Home() {
  const theme = useTheme();
  const { setThemeMode } = useTheme();

  useEffect(() => {
    setThemeMode("dark");
  })

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.typography.title, { color: theme.colors.primary }]}>
        Bem-vindo ao BarberBross!
      </Text>
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
});
