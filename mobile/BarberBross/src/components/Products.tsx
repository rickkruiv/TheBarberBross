import { Text, Image, YStack, XStack, useTheme, Button } from "tamagui";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from "react-native";
import { formatCurrency } from '../utils/format';

type Products = {
  id: string;
  image: any;
  desc: string;
};

const products = [
  {
    id: "1",
    image: require("../assets/icons/pomada.png"),
    desc: "Pomada",
    price: 25,
  },
  {
    id: "2",
    image: require("../assets/icons/creme-barbear.png"),
    desc: "Creme de barbear",
    price: 34.69,
  },
  {
    id: "3",
    image: require("../assets/icons/hidratante.png"),
    desc: "Hidratante capilar",
    price: 16.59,
  },
];

export default function Products({ onSelectProduct }) {
  const theme = useTheme();

  return (
    <YStack gap="$4">
      {products.map((product) => {
        return (
          <Pressable
            key={product.id}
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
                    src={product.image}
                    width={40}
                    height={40}
                  />
                </XStack>

                <YStack flex={1} gap="$1" justifyContent="center">
                  <Text fontSize={"$4"} fontWeight={"700"}>{product.desc}</Text>
                  <Text fontSize={"$3"} color={"$textSecondary"}>{formatCurrency(product.price)}</Text>
                </YStack>
              </XStack>

              <YStack
                paddingHorizontal={"$4"}
                paddingVertical={"$1"}
                backgroundColor="$primary"
                borderRadius="$2"
              >
                <Text fontSize="$4" color={"#F5F5F7"} fontWeight={"bold"}>Order</Text>
              </YStack>
            </XStack>
          </Pressable>
        );
      })}
    </YStack>
  );
}