import { ArrowLeft } from "@tamagui/lucide-icons-2";
import { router } from "expo-router";
import { Text, XStack } from "tamagui";

export default function VoltarButton() {
  return (
    <XStack
      paddingVertical="$4"
      alignItems="center"
      gap="$3"
      onPress={() => router.back()}
    >
      <ArrowLeft size={20} color="$text" />
      <Text fontSize="$5" fontWeight="700" color="$text">Voltar</Text>
    </XStack>
  );
}