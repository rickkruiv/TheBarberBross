import { Card, ScrollView, Separator, Text, XStack, YStack, useTheme } from "tamagui";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Mail, Phone } from "@tamagui/lucide-icons-2";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function UserInformation() {
  const { cliente } = useAuth();
  const theme       = useTheme();

  return (
    <ScrollView flex={1} background="$background" padding="$4" paddingBottom="$8">
      <XStack
        paddingVertical="$4"
        alignItems="center"
        gap="$3"
        onPress={() => router.back()}
      >
        <ArrowLeft size={18} color="$text" />
        <Text fontSize="$6" fontWeight="700" color="$text">Voltar</Text>
      </XStack>

      <YStack gap={"$4"} alignContent="center" justifyContent="center">

        <YStack alignItems="center" justifyContent="center" gap={"$3"}>
          <YStack
            flex={1}
            alignSelf="center"
            width={128}
            height={128}
            borderRadius={64}
            borderWidth={1}
            borderColor="$border"
            alignItems="center"
            justifyContent="center" >
            <Ionicons name="person" size={80}  color={theme.textSecondary?.val}/>
          </YStack>
          <Text fontSize={"$6"} fontWeight="700" color="$text">{cliente?.nome}</Text>
        </YStack>

        <YStack
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$border"
          borderRadius={"$4"}
          alignContent="center"
          justifyContent="center"
          padding={"$4"}
          gap={"$2"} >

          <Text fontSize="$6" fontWeight="700">Informações pessoais</Text>

          <YStack>
            <YStack gap={"$4"}>
              <XStack gap="$4" alignItems="center">
                <Mail size={22} color="$textSecondary" />
                <YStack gap={"$2"}>
                  <Text color="$textMuted" fontSize="$3">Email</Text>
                  <Text color="$text" fontSize="$5">{cliente?.email ?? "-"}</Text>
                </YStack>
              </XStack>

              <XStack gap="$4" alignItems="center">
                <Phone size={22} color="$textSecondary" />
                <YStack gap={"$2"}>
                  <Text color="$textMuted" fontSize="$3">Telefone</Text>
                  <Text color="$text" fontSize="$5">{cliente?.telefone ?? "-"}</Text>
                </YStack>
              </XStack>

            </YStack>
          </YStack>

        </YStack>
      </YStack>
    </ScrollView>
  );
}