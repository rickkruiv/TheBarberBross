import { Text, XStack, useTheme, YStack, Button } from "tamagui";
import { KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { useRef, useState } from "react";
import InputParts from "../../components/InputParts";
import VoltarButton from "../../components/VoltarButton";
import { registrarCliente } from "../../services/clienteService";

export default function Register() {
  const theme = useTheme();

  const nameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);
  const passRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function validate() {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (!form.name) newErrors.name                   = "Digite seu nome";
    if (!form.email) newErrors.email                 = "Digite seu email";
    if (!form.phone) newErrors.phone                 = "Digite seu telefone";
    if (!form.password) newErrors.password           = "Digite sua senha";
    if (form.password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Senhas não coincidem";

    setErrors(newErrors);

    if (newErrors.name) return nameRef.current?.focus();
    if (newErrors.email) return emailRef.current?.focus();
    if (newErrors.phone) return phoneRef.current?.focus();
    if (newErrors.password) return passRef.current?.focus();
    if (newErrors.confirmPassword) return confirmRef.current?.focus();

    return true;
  }

  async function handleRegister() {
    if (!validate()) return;

    try {
      const payload = {
        nome: form.name,
        email: form.email,
        senha: form.password,
        telefone: form.phone
      };

      await registrarCliente(payload);

      Alert.alert(
        "Conta criada",
        "Sua conta foi criada com sucesso!",
        [
          {
            text: "Ir para login",
            onPress: () => router.replace("/(auth)/login"),
          }
        ]
      )
    } catch (error: any) {
      console.log(error?.response?.data);

      Alert.alert(
        "Erro ao cadastrar",
        error?.response?.data?.message || "Não foi possível criar a conta"
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <YStack padding={"$4"} >
          <VoltarButton />

          <YStack flex={1} justifyContent="center">
            <Text fontSize="$8" fontWeight="700" color={theme.text?.val}>
              Criar conta
            </Text>

            <YStack gap="$4">
              <YStack>
                <InputParts
                  ref={nameRef}
                  label="Nome"
                  placeholder="Digite seu nome"
                  icon="person-outline"
                  value={form.name}
                  onChangeText={(v) => {
                    setForm({ ...form, name: v });
                    setErrors(prev => ({ ...prev, name: "" }));
                  }}
                  error={errors.name}
                  autoCapitalize="words" />

                <InputParts
                  ref={emailRef}
                  label="Email"
                  placeholder="Digite seu email"
                  icon="mail-outline"
                  value={form.email}
                  onChangeText={(v) => {
                    setForm({ ...form, email: v });
                    setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  error={errors.email}
                  keyboardType="email-address" />

                <InputParts
                  ref={phoneRef}
                  label="Telefone"
                  placeholder="(44) 99999-9999"
                  icon="call-outline"
                  value={form.phone}
                  onChangeText={(v) => {
                    setForm({ ...form, phone: v });
                    setErrors(prev => ({ ...prev, phone: "" }));
                  }}
                  error={errors.phone}
                  keyboardType="phone-pad" />

                <InputParts
                  ref={passRef}
                  label="Senha"
                  placeholder="Digite sua senha"
                  icon="lock-closed-outline"
                  value={form.password}
                  onChangeText={(v) => {
                    setForm({ ...form, password: v });
                    setErrors(prev => ({ ...prev, password: "" }));
                  }}
                  secureTextEntry={!showPassword}
                  onIconPress={() => setShowPassword(v => !v)}
                  error={errors.password} />

                <InputParts
                  ref={confirmRef}
                  label="Confirmar senha"
                  placeholder="Repita sua senha"
                  icon="lock-closed-outline"
                  value={form.confirmPassword}
                  onChangeText={(v) => {
                    setForm({ ...form, confirmPassword: v });
                    setErrors(prev => ({ ...prev, confirmPassword: "" }));
                  }}
                  secureTextEntry={!showConfirm}
                  onIconPress={() => setShowConfirm(v => !v)}
                  error={errors.confirmPassword} />
              </YStack>

              <Button size={"$9"} backgroundColor={"$primary"} borderRadius={"$6"} onPress={handleRegister} >
                <Text fontWeight={700} fontSize={"$4"}>Criar conta</Text>
              </Button>

              <XStack justifyContent="center">
                <Pressable onPress={() => router.replace("/(auth)/login")}>
                  <Text color="$textSecondary">Já tenho conta</Text>
                </Pressable>
              </XStack>

            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}