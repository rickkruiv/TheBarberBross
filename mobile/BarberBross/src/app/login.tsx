import { Text, XStack, useTheme, YStack, Button } from "tamagui";
import InputParts from "../components/InputParts";
import { Pressable } from "react-native";
import { router } from "expo-router";

export default function Login() {
  const theme = useTheme();

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding={"$4"}
      backgroundColor={"$background"}
    >
      <YStack width={"100%"} >
        <Text fontSize={"$8"} color={theme.text.val}>Login</Text>
        <YStack gap={"$4"}>
          <YStack>
            <InputParts label={"Email / Phone"} placeholder={"Email / Phone"} icon={"mail"} />
            <InputParts label={"Password"} placeholder={"Password"} icon={"eye"} />
          </YStack>

          <Button
            size={"$9"}
            backgroundColor={"$primary"}
            borderRadius={"$6"}
          >
            <Text>Login</Text>
          </Button>

          <XStack gap="$3" alignItems="center" justifyContent="center" >
            <Pressable onPress={() => router.push('/register')}>
                <Text color={"$primary"}>{"Register"}</Text>
            </Pressable>

            <Pressable>
                <Text color={"$primary"}>{"Forgot password"}</Text>
            </Pressable>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}