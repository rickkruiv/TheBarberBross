import { ImageBackground, StyleSheet } from "react-native";
import { YStack, Text, Button } from "tamagui";
import { router } from "expo-router";

export default function Presentation() {
  return (
    <ImageBackground
      source={require("../../assets/barber.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <YStack flex={1} backgroundColor="rgba(0, 0, 0, 0.67)">

        <YStack flex={1} justifyContent="flex-end" padding="$6" gap="$4">
          <YStack gap={"$4"}>
            <Text fontSize="$7" fontWeight="800" color="$text">Seu melhor versão começa aqui!</Text>

            <Text fontSize="$4" color="$textSecondary">
              Agende horários, encontre barbeiros e cuide do seu visual sem complicação.
            </Text>
          </YStack>

          <Button
            size={"$9"}
            backgroundColor={"$primary"}
            borderRadius={"$6"}
            onPress={() => router.push("/(auth)/login")} >
            <Text fontSize={"$4"} fontWeight={700} >Entrar</Text>
          </Button>

          <Button
            variant="outlined"
            size={"$9"}
            borderRadius={"$6"}
            borderColor={"$primary"}
            onPress={() => router.push("/(auth)/register")} >
            <Text fontSize={"$4"} fontWeight={700} >Criar conta</Text>
          </Button>
          <Text fontSize={"$3"} color={"$textMuted"} textAlign="center">© 2026 BrossSoft Sistemas. Todos os direitos reservados.</Text>

        </YStack>

      </YStack>
    </ImageBackground>
  );
}
