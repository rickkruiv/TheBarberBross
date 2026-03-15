import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";

function RootLayoutNav() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}