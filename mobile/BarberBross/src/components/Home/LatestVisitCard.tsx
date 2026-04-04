import { YStack, Text, Image, XStack, Button } from 'tamagui';

const data = {
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6pnWIg8ieDPCXAuLnryBmdB_E2BoZXJ1mjw&s",
  name: "Mr. Chavozo",
  service: "Haircut",
}

export default function LatestVisitCard() {

  return (
    <XStack
      height={70}
      padding="$3"
      borderRadius="$4"
      backgroundColor="$backgroundInverse"
      borderWidth={1}
      borderColor="$border"
      alignItems="center"
      gap="$3"
    >
      <XStack borderRadius="$3" overflow="hidden">
        <Image
          src={data.image}
          width={50}
          height={50}
        />
      </XStack>

      <XStack flex={1} justifyContent="space-between" alignItems="center" gap="$3">
        <YStack>
          <Text fontSize="$4" fontWeight="600" color="$textInverse">{data.name}</Text>
          <Text fontSize="$3" color="$textSecundaryInverse">{data.service}</Text>
        </YStack>

        <Button
          size="$6"
          backgroundColor="$background"
          borderRadius="$2"
        >
          <Button.Text fontSize="$4" color="$text">Book</Button.Text>
        </Button>
      </XStack>
    </XStack>
  );
}