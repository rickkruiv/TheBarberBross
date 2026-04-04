import { Text, Image, YStack, XStack, useTheme, Button } from "tamagui";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from "react-native";

type Professionals = {
  id: string;
  nome: string;
  desc: string;
  socials: Social[];
  image: any;
};

type Social = "instagram" | "facebook" | "youtube" | "tiktok";

const socialIconsMap: Record<Social, keyof typeof Ionicons.glyphMap> = {
  instagram: "logo-instagram",
  facebook: "logo-facebook",
  youtube: "logo-youtube",
  tiktok: "logo-tiktok",
};

const professionals: Professionals[] = [
  {
    id: "1",
    image: require("../../assets/icons/barbeiro.png"),
    nome: "Adriano",
    desc: "No description",
    socials: ["instagram", "facebook", "youtube", "tiktok"],
  },
  {
    id: "2",
    image: require("../../assets/icons/barbeiro.png"),
    nome: "Matheus",
    desc: "No description",
    socials: ["instagram", "tiktok"],
  },
  {
    id: "3",
    image: require("../../assets/icons/barbeiro.png"),
    nome: "Ithalo",
    desc: "Se quiser melhorar a autoestima, é só chamar! 😉",
    socials: ["instagram", "facebook", "tiktok"],
  },
];

export default function Professionals({}) {
  const theme = useTheme();

  return (
    <YStack gap="$4">
      {professionals.map((professional) => {
        return (
          <XStack
            key={professional.id}
            alignItems="center"
            justifyContent="space-between"
            borderWidth={1}
            padding={"$3"}
            borderColor={"$border"}
            borderRadius={"$4"}
            backgroundColor={"$backgroundSecondary"}
            gap={"$4"}
          >
            <XStack gap={"$3"} alignItems="center" flex={1}>
              <XStack
                padding={"$2"}
                borderRadius={"$3"}
                backgroundColor={"#F5F5F7"}
              >
                <Image
                  src={professional.image}
                  width={40}
                  height={40}
                />
              </XStack>

              <YStack flex={1} gap="$1" justifyContent="center">
                <Text fontSize={"$4"} fontWeight={"700"}>{professional.nome}</Text>
                <Text fontSize={"$3"} color={"$textSecondary"}>{professional.desc}</Text>
                <XStack gap={"$4"}>
                  {professional.socials.map((social) => {
                    return (
                      <Pressable
                        key={social}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.7 : 1,
                          transform: [{ scale: pressed ? 0.99 : 1 }],
                        })}
                      >
                        <Ionicons name={socialIconsMap[social]} size={18} color={theme.textSecondary?.val} />
                      </Pressable>
                    );
                  })}
                </XStack>
              </YStack>
            </XStack>

          </XStack>

        );
      })}
    </YStack>
  );
}