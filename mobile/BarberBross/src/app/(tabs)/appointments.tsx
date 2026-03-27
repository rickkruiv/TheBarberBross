import { Link } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { YStack, Text, Button } from "tamagui"

export default function Appointments() {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$3"
      backgroundColor="$background"
    >
      <Text color="$text" fontSize="$5">
        Appointment Screen!
      </Text>

      <Link href="/teste" asChild>
        <Button size="$3">
          Go to Search screen
        </Button>
      </Link>

      <StatusBar style="auto" />
    </YStack>
  )
}