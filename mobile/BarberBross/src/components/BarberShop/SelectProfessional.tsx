import { Pressable } from 'react-native';
import { Image, ScrollView, Text, XStack, YStack } from 'tamagui';

type Props = {
  selectedProfessional: any;
  onSelectProfessional: (professional: any) => void;
};

const professionals = [
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

export default function SelectProfessional({ selectedProfessional, onSelectProfessional, }: Props) {

  return (
    <YStack>
      <Text fontSize={"$5"} fontWeight="700" marginBottom="$2">
        Escolha o profissional
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <XStack gap={"$3"}>

          {professionals.map((professional) => {
            const isSelected = selectedProfessional?.id === professional.id;

            return (
              <Pressable
                key={professional.id}
                onPress={() => onSelectProfessional(professional)}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                })}
              >
                <YStack
                  padding="$1"
                  borderRadius="$2"
                  borderWidth={1}
                  borderColor={isSelected ? "$primary" : "$border"}
                  backgroundColor={isSelected ? "$primarySoft" : "$backgroundSecondary"}
                  opacity={isSelected ? 1 : 0.7}
                >

                  <YStack
                    alignItems="center"
                    justifyContent="space-between"
                    padding={"$2"}
                    gap={"$1"}
                  >
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

                    <Text>
                      {professional.nome}
                    </Text>
                  </YStack>
                </YStack>

              </Pressable>
            );
          })}
        </XStack>

      </ScrollView>
    </YStack>
  );
}