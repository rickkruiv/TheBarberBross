import { Text, Image, YStack, XStack, useTheme, Button } from "tamagui";
import { Clock } from "@tamagui/lucide-icons-2";
import { Pressable } from "react-native";
import { formatCurrency, formatDuration } from '../utils/format';

const services = [
  {
    id: "1",
    image: require("../assets/icons/tesoura.png"),
    desc: "Corte de cabelo",
    duracao: 30,
    valor: 50.00,
  },
  {
    id: "2",
    image: require("../assets/icons/barba.png"),
    desc: "Barba",
    duracao: 30,
    valor: 50.00,
  },
  {
    id: "3",
    image: require("../assets/icons/barba-cabelo.png"),
    desc: "Barba e cabelo",
    duracao: 60,
    valor: 95.00,
  },
  {
    id: "4",
    image: require("../assets/icons/navalha.png"),
    desc: "Sobrancelha",
    duracao: 15,
    valor: 30.00,
  },
  {
    id: "5",
    image: require("../assets/icons/creme-de-barbear.png"),
    desc: "Hidratação",
    duracao: 45,
    valor: 60.00,
  },
  {
    id: "6",
    image: require("../assets/icons/gotas.png"),
    desc: "Tintura",
    duracao: 90,
    valor: 120.00,
  },
  {
    id: "7",
    image: require("../assets/icons/escova-de-barbear.png"),
    desc: "Barboterapia",
    duracao: 120,
    valor: 150.00,
  },
];

export default function Services({ onSelectService }) {
  const theme = useTheme();

  return (
    <YStack gap="$4">
      {services.map((service) => {
        return (
          <Pressable 
            key={service.id} 
            onPress={() => onSelectService(service)}
            style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
          >

            <XStack
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
                    src={service.image}
                    width={40}
                    height={40}
                  />
                </XStack>

                <YStack flex={1} gap="$1">
                  <Text fontSize={"$4"} fontWeight={"700"}>{service.desc}</Text>

                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={"$3"} color={"$textSecondary"}>{formatCurrency(service.valor)}</Text>

                    <XStack alignItems="center" gap={"$1"}>
                      <Text fontSize={"$3"} color={"$textSecundary"}>{formatDuration(service.duracao)}</Text>
                      <Clock size={14} color={theme.textSecondary.val} />
                    </XStack>
                  </XStack>

                </YStack>
              </XStack>

              <YStack
                paddingHorizontal={"$4"}
                paddingVertical={"$1"}
                backgroundColor="$primary"
                borderRadius="$2"
              >
                <Text fontSize="$4" color={"#F5F5F7"} fontWeight={"bold"}>Book</Text>
              </YStack>
            </XStack>
          </Pressable>

        );
      })}
    </YStack>
  );
}