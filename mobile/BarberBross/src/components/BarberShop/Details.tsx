import { Text, XStack, YStack, useTheme } from "tamagui";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MapPin } from "@tamagui/lucide-icons-2";
import { Linking } from 'react-native';
import { Pressable } from "react-native";

const socialIcons: React.ComponentProps<typeof Ionicons>["name"][] = [
  "logo-whatsapp",
  "logo-instagram",
  "logo-facebook",
  "logo-youtube",
];

const amenities: React.ComponentProps<typeof Ionicons>["name"][] = [
  "wifi",
  "car",
  "accessibility",
  "fast-food",
  "snow",
];

const paymentMethods = ["Dinheiro", "Pix", "Crédito", "Débito", "Permuta"];

const getOpeningDays = () => [
  { day: "Segunda", hours: "09:30 - 19:30" },
  { day: "Terça"  , hours: "09:30 - 19:30" },
  { day: "Quarta" , hours: "09:30 - 19:30" },
  { day: "Quinta" , hours: "09:30 - 19:30" },
  { day: "Sexta"  , hours: "09:30 - 19:30" },
  { day: "Sábado" , hours: "10:30 - 17:30" },
  { day: "Domingo", hours: "Fechado" },
]

const CardItem = ({ children }: { children: React.ReactNode }) => (
  <YStack
    backgroundColor="$backgroundSecondary"
    padding="$2"
    borderRadius="$2"
  >
    {children}
  </YStack>
);

export default function Details() {
  const theme = useTheme();
  const today = new Date().getDay() - 1;

  return (
    <YStack gap={"$5"}>
      <YStack gap={"$2"} >
        <Text fontSize={"$5"} fontWeight={"600"}>About</Text>
        <Text fontSize={"$4"} textAlign="left">
          Venha conhecer o nosso trabalho e sair renovado, especializados em renovar a sua autoestima!
        </Text>
      </YStack>

      <YStack gap={"$2"}>
        <Text fontSize={"$5"} fontWeight={"600"}>Amenities</Text>
        <XStack gap={"$3"}>
          {amenities.map((amenitie) => {
            return (
              <CardItem key={amenitie}>
                <Ionicons name={amenitie} size={32} color={theme.textSecondary.val} />
              </CardItem>
            );
          })}
        </XStack>
      </YStack>

      <YStack gap={"$2"}>
        <Text fontSize={"$5"} fontWeight={"600"}>Opening Hours</Text>
        <YStack>
          {getOpeningDays().map((item, index) => (
            <XStack
              key={item.day}
              justifyContent="space-between"
              paddingHorizontal={"$2"}
              paddingVertical={"$1"}
              backgroundColor={index % 2 === 0 ? "$backgroundSecondary" : "$background"}
              borderWidth={index === today ? 1 : 0}
              borderRadius={index === today ? "$4" : 0}
              borderColor={"$primarySoft"}
            >
              <Text fontWeight={index === today ? "700" : "400"} fontSize={"$4"}>{item.day}</Text>
              <Text fontWeight={index === today ? "700" : "400"} color="$textSecondary" fontSize={"$4"}>{item.hours}</Text>
            </XStack>
          ))}
        </YStack>
      </YStack>

      <YStack gap={"$2"}>
        <Text fontSize={"$5"} fontWeight={"600"}>Address</Text>

        <Pressable onPress={() => Linking.openURL('https://maps.app.goo.gl/VZZzfatBucJjuhcy7')}>
          <XStack alignItems="center" gap={"$2"}>
            <MapPin size={12} color={theme.textSecondary.val} />
            <Text color={"$textSecondary"}>{"Av. Gastão Vidigal, 1934 - Zona 08"}</Text>
          </XStack>
        </Pressable>
      </YStack>

      <YStack gap={"$2"}>
        <Text fontSize={"$5"} fontWeight={"600"}>Payment methods</Text>
        <XStack gap={"$3"}>
          {paymentMethods.map((paymentMethod) => {
            return (
              <CardItem key={paymentMethod}>
                <Text>{paymentMethod}</Text>
              </CardItem>
            );
          })}
        </XStack>
      </YStack>

      <YStack gap={"$2"}>
        <Text fontSize={"$5"} fontWeight={"600"}>Social network</Text>
        <XStack gap={"$3"}>
          {socialIcons.map((socialIcon) => {
            return (
              <CardItem key={socialIcon}>
                <Ionicons name={socialIcon} size={32} color={theme.textSecondary.val} />
              </CardItem>
            );
          })}
        </XStack>
      </YStack>
    </YStack>
  );
}