import { YStack, XStack, Text, Image } from "tamagui";

type Props = {
  pontos?: number;
  total?: number;
};

export default function LoyaltyCard({ pontos = 2, total = 10 }: Props) {
  const boxes = Array.from({ length: total });

  return (
    <YStack gap="$4" >
      <XStack justifyContent="space-between" alignItems="center">
        <Text color="$text" fontWeight={"700"} fontSize="$5">CARTÃO FIDELIDADE</Text>
      </XStack>

      <XStack
        flexWrap="wrap"
        gap="$3"
        justifyContent="center"
        borderWidth={1}
        paddingVertical={"$6"}
        borderRadius={"$3"}
        borderColor={"$border"}
        backgroundColor={"$backgroundSecondary"}
      >
        {boxes.map((_, i) => {
          const filled = i < pontos;

          return (
            <YStack
              key={i}
              width={55}
              height={55}
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
              backgroundColor={filled ? "$primarySoft" : "$backgroundInverse"}
              borderWidth={1}
              borderColor={filled ? "$primary" : "$border"}
            >
              {filled && (
                <Image
                  src={require("../assets/icons/carimbo.png")}
                  width={30}
                  height={30}
                />
              )}
            </YStack>
          );
        })}
      </XStack>

      <Text textAlign="center" color="$textMuted" fontSize="$3" >
        *A cada 10 agendamentos você ganha 10% de desconto
      </Text>
    </YStack>
  );
}