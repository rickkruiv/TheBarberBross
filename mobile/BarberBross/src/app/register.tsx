import { Text, XStack, useTheme, YStack, Input, Button } from "tamagui";
import InputParts from "../components/InputParts";
import { Linking, Pressable } from "react-native";
import { router } from "expo-router";

export default function Register() {
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
        <Text fontSize={"$8"} color={theme.text.val}>Register</Text>
        <YStack gap={"$4"}>
          <YStack>
            <InputParts label={"Name"} placeholder={"Name"} icon={"person-circle-outline"} />
            <InputParts label={"Email"} placeholder={"Email"} icon={"mail"} />
            <InputParts label={"Phone"} placeholder={"Phone"} icon={"call"} />
            <InputParts label={"Password"} placeholder={"Password"} icon={"eye"} />
            <InputParts label={"Confirm password"} placeholder={"Confirm password"} icon={"eye"} />
          </YStack>

          <Button
            size={"$9"}
            backgroundColor={"$primary"}
            borderRadius={"$6"}
          >
            <Text>Register</Text>
          </Button>

          <XStack gap="$3" alignItems="center" justifyContent="center" >
            <Pressable onPress={() => router.push("/login")}>
              <XStack alignItems="center" gap={"$2"}>
                <Text color={"$primary"}>{"Login"}</Text>
              </XStack>
            </Pressable>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}