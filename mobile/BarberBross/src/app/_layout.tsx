import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider, useTheme } from "tamagui";
import { tamaguiConfig } from "../../tamagui.config";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import 'react-native-reanimated';

function AppContent() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.val,
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeMode = "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={themeMode}>
          <AppContent />
        </TamaguiProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}