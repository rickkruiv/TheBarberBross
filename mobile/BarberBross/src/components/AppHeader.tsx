import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { XStack, Text, useTheme } from 'tamagui';

export default function AppHeader() {
  const theme = useTheme();

  return (
    <XStack 
      padding={"$5"}
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={"$background"}
      >
      <Text
        fontWeight={"600"}
        fontSize={"$5"}
        color={theme.text.val}
      >
        BarberBross
      </Text>

      <XStack gap={"$3"} >
        <Pressable>
          <Ionicons name={!true ? "notifications" : "notifications-outline"} size={22} color={theme.text.val} />
        </Pressable>

        <Pressable>
          <Ionicons name="menu" size={24} color={theme.text.val} />
        </Pressable>
      </XStack>
    </XStack>
  );
}