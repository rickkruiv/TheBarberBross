import { YStack, Text } from "tamagui"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useTheme } from "tamagui"

export default function TabItem({ label, icon, active, onPress }: any) {
  const theme = useTheme()

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$1"
      padding="$1"
      borderRadius="$4"
      pressStyle={{ scale: 0.95 }}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={22}
        color={active ? theme.primary?.val : theme.text?.val}
      />

      <Text
        fontSize="$3"
        fontWeight="600"
        color={active ? "$primary" : "$text"}
      >
        {label}
      </Text>
    </YStack>
  )
}