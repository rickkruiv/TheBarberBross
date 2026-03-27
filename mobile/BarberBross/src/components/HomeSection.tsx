import { YStack, Text } from 'tamagui';

export default function HomeSection({ title, children }) {

  return (
    <YStack gap="$3">
      <Text fontSize="$4" fontWeight="600" color="$text">
        {title}
      </Text>

      <YStack gap="$2">
        {children}
      </YStack>
    </YStack>
  );
}