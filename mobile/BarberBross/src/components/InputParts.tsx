import { Input, Text, useTheme, XStack, YStack } from "tamagui";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function InputParts({label, placeholder, icon}: any) {
  const theme = useTheme(); 
  return (
    <YStack>

      <Text
        color={"$text"}
        paddingVertical={"$3"}
        paddingHorizontal={"$1"}
      >
        {label}
      </Text>
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$1"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$border"
        alignItems="center"
        gap="$2"
        backgroundColor="$backgroundSecondary"
      >
        <Ionicons name={icon} size={24} color={theme.textSecondary.val} />
        <Input
          flex={1}
          size="$8"
          borderWidth={0}
          padding="$2"
          backgroundColor="transparent"
          placeholder={placeholder}
          placeholderTextColor="$textMuted"
          fontSize={"$2"}
        />
      </XStack>

    </YStack>
  );
}