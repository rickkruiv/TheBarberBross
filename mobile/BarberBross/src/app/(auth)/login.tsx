import { Text, XStack, useTheme, YStack, Button } from "tamagui";
import InputParts from "../../components/InputParts";
import { Alert, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export default function Login() {
  const theme     = useTheme();
  const { login } = useAuth();

  const [username, setUsername]         = useState("");
  const [senha, setSenha]               = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  async function handleLogin() {
    if (!username && !senha) {
      Alert.alert("Erro", "Preencha os usuário e senha!");
      return;
    }

    try {
      setSubmitting(true);
      await login({username, senha});
    } catch (error) {
      console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
      Alert.alert("Erro", "Usuário ou senha inválidos!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding={"$4"}
      backgroundColor={"$background"}
    >
      <YStack width={"100%"} >
        <Text fontSize={"$8"} color={theme.text?.val}>Login</Text>
        <YStack gap={"$4"}>
          <YStack>
            <InputParts label={"Email / Phone"} placeholder={"Email / Phone"} icon={"mail"} value={username} onChangeText={setUsername} />
            <InputParts label={"Password"} placeholder={"Password"} icon={"eye"} value={senha} onChangeText={setSenha} secureTextEntry />
          </YStack>

          <Button size={"$9"} backgroundColor={"$primary"} borderRadius={"$6"} disabled={submitting} onPress={handleLogin} >
            <Text>{submitting ? "Entrando..." : "Login"}</Text>
          </Button>

          <XStack gap="$3" alignItems="center" justifyContent="center" >
            <Pressable onPress={() => router.push('/(auth)/register')}>
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