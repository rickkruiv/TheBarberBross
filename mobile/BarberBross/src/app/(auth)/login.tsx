import { Text, XStack, useTheme, YStack, Button } from "tamagui";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import InputParts from "../../components/InputParts";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useRef } from "react";
import VoltarButton from "../../components/VoltarButton";

export default function Login() {
  const theme = useTheme();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<any>(null);
  const senhaRef = useRef<any>(null);

  const [errors, setErrors] = useState({
    username: "",
    senha: "",
  });

  async function handleLogin() {
    const newErrors = { username: "", senha: "" };

    if (!username) newErrors.username = "Digite seu email";
    if (!senha) newErrors.senha = "Digite sua senha";

    setErrors(newErrors);

    if (newErrors.username) {
      emailRef.current?.focus();
      return;
    }

    if (newErrors.senha) {
      senhaRef.current?.focus();
      return;
    }

    try {
      setSubmitting(true);
      await login({ username, senha });
    } catch (error) {
      setErrors({
        username: "Email ou senha inválidos",
        senha: "Email ou senha inválidos",
      });

      senhaRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <YStack padding={"$4"} >

          <VoltarButton />

          <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            backgroundColor={"$background"}
          >
            <YStack width={"100%"} >
              <Text fontSize={"$8"} fontWeight={700} color={theme.text?.val}>Entre com a sua conta!</Text>
              <YStack gap={"$4"}>
                <YStack>
                  <InputParts
                    ref={emailRef}
                    label="Email"
                    placeholder="Digite seu email"
                    icon="mail-outline"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      setErrors(prev => ({ ...prev, username: "" }));
                    }}
                    keyboardType="email-address"
                    error={errors.username}
                  />

                  <InputParts
                    ref={senhaRef}
                    label="Senha"
                    placeholder="Digite sua senha"
                    icon="lock-closed-outline"
                    value={senha}
                    onChangeText={(text) => {
                      setSenha(text);
                      setErrors(prev => ({ ...prev, senha: "" }));
                    }}
                    secureTextEntry={!showPassword}
                    onIconPress={() => setShowPassword(v => !v)}
                    error={errors.senha}
                  />
                </YStack>

                <Button size={"$9"} backgroundColor={"$primary"} borderRadius={"$6"} disabled={submitting} onPress={handleLogin} >
                  <Text fontWeight={700} fontSize={"$4"}>{submitting ? "Entrando..." : "Entrar"}</Text>
                </Button>

                <YStack gap="$2" alignItems="center">
                  <Pressable>
                    <Text color="$textSecondary">Não tem conta?{"  "}<Text color="$secundary" textDecorationLine="underline" onPress={() => router.push('/(auth)/register')}>Criar conta</Text></Text>
                  </Pressable>

                  <Pressable>
                    <Text color="$textSecondary" textDecorationLine="underline">Esqueceu a senha?</Text>
                  </Pressable>
                </YStack>
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}