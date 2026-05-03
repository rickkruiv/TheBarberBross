import { YStack, XStack, Text, Button, useTheme } from "tamagui"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, Linking, ScrollView, Alert } from "react-native"
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

type MenuItemProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"]
  title: string
  onPress: () => void
  isExternalLink?: boolean
  isDestructive?: boolean
}

export default function Menu() {
  const theme       = useTheme();
  const router      = useRouter();
  const { logout }  = useAuth();
  const { cliente } = useAuth();

  function handleLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout }
      ]
    );
  }

  const handleOpenTerms = () => {
    Linking.openURL("https://google.com") // Temporario... qnd e se tiver, atulaizar kk
  }

  const MenuItem = ({icon,
                    title,
                    onPress,
                    isExternalLink = false,
                    isDestructive = false,}: MenuItemProps) => {

    const iconColor = isDestructive ? theme.error?.val : theme.textSecondary?.val
    const textColor = isDestructive ? theme.error?.val : theme.text?.val

    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]} >
        <XStack
          paddingHorizontal={16}
          paddingVertical={14}
          borderBottomWidth={1}
          borderColor="$divider"
          justifyContent="space-between"
          alignItems="center" >
          <XStack alignItems="center" gap="$3">
            <XStack
              width={36}
              height={36}
              borderRadius={10}
              alignItems="center"
              justifyContent="center"
              background="$surfaceElevated" >
              <Ionicons name={icon} size={22} color={iconColor} />
            </XStack>
            <Text color={textColor} fontSize={16} fontWeight="500">{title}</Text>
          </XStack>

          <Ionicons
            name={isExternalLink ? "open-outline" : "chevron-forward"}
            size={20}
            color={isDestructive ? theme.error?.val : theme.textMuted?.val} />
        </XStack>
      </Pressable>
    )
  }
  return (
    <YStack flex={1} background="$background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" paddingBottom="$8">

          <XStack alignItems="center" gap="$4" marginBottom="$6" marginTop="$2">
            <XStack
              width={64}
              height={64}
              borderRadius={32}
              borderWidth={1}
              borderColor="$border"
              alignItems="center"
              justifyContent="center" >
              <Ionicons name="person" size={40} color={theme.textSecondary?.val} />
            </XStack>

            <YStack>
              <Text fontSize={20} fontWeight="700" color="$text">{cliente?.nome}</Text>
              <Text color="$textSecondary" marginTop={4} >{cliente?.email}</Text>
            </YStack>
          </XStack>

          <YStack
            borderRadius={16}
            borderWidth={1}
            borderColor="$border"
            background="$surface"
            overflow="hidden"
            marginBottom="$4" >
            <MenuItem icon="person-outline"   title="Meu acesso / informações" onPress={() => router.push("/userInformation") } />
            <MenuItem icon="settings-outline" title="Preferências"             onPress={() => { }} />
            {/* sem configuracao de endereco disponivel */}
            {/* <MenuItem icon="location-outline" title="Endereço"                 onPress={() => { }} /> */}
          </YStack>

          <YStack borderRadius={16} borderWidth={1} borderColor="$border" background="$surface" overflow="hidden" marginBottom="$4">
            <MenuItem icon="heart-outline"  title="Favoritos"         onPress={() => { }} />
            <MenuItem icon="cube-outline"   title="Pacotes"           onPress={() => { }} />
            <MenuItem icon="time-outline"   title="Histórico"         onPress={() => { }} />
            <MenuItem icon="wallet-outline" title="Gastos"            onPress={() => { }} />
          </YStack>

          <YStack borderRadius={16} borderWidth={1} borderColor="$border" background="$surface" overflow="hidden">
            <MenuItem icon="document-text-outline" title="Termos de uso" onPress={handleOpenTerms} isExternalLink />
          </YStack>

          <YStack
            borderRadius={16}
            borderWidth={1}
            borderColor="$border"
            background="$surface"
            overflow="hidden"
            marginTop="$6" >
            <MenuItem icon="log-out-outline" title="Sair da conta" onPress={handleLogout} isDestructive />
          </YStack>

          <Text color="$textMuted" textAlign="center" marginTop="$8" marginBottom="$4">Versão do aplicativo 1.0.0 © 2026 BrossSoft Sistemas. Todos os direitos reservados.</Text>

        </YStack>
      </ScrollView>
    </YStack>
  )
}