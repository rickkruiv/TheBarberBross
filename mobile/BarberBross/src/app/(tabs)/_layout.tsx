import { Slot, usePathname, useRouter } from "expo-router";
import { XStack, YStack } from "tamagui";
import AppHeader from "../../components/AppHeader";
import TabItem from "../../components/TabItem";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <YStack flex={1} backgroundColor="$background">
      <AppHeader />

      <YStack flex={1}>
        <Slot />
      </YStack>

      <XStack
        backgroundColor="$background"
        borderTopWidth={1}
        borderColor="$divider"
        padding="$3"
        justifyContent="space-around"
      >
        <TabItem
          label="Home"
          icon="home"
          active={pathname === "/home"}
          onPress={() => router.push("/home")}
        />

        <TabItem
          label="Appointments"
          icon="time-outline"
          active={pathname === "/appointments"}
          onPress={() => router.push("/appointments")}
        />

        <TabItem
          label="Haircut"
          icon="sparkles"
          active={pathname === "/aihaircutview"}
          onPress={() => router.push("/aihaircutview")}
        />

        <TabItem
          label="Menu"
          icon="person-circle-outline"
          active={pathname === "/menu"}
          onPress={() => router.push("/menu")}
        />
      </XStack>
    </YStack>
  );
}