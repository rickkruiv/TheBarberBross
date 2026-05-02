import 'react-native-reanimated';
import '@tamagui/native/setup-expo-linear-gradient'

import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider, useTheme } from "tamagui";
import tamaguiConfig from "../../tamagui.config";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";

function AppContent() {
  const theme = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/home");
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </TamaguiProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}