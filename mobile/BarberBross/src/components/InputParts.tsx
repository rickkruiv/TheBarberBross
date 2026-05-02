import { Input, Text, useTheme, XStack, YStack } from "tamagui";
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  label: string;
  placeholder: string;
  icon: any;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export default function InputParts({label,
                                    placeholder,
                                    icon,
                                    value,
                                    onChangeText,
                                    secureTextEntry}: Props) {
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
        <Ionicons name={icon} size={24} color={theme.textSecondary?.val} />
        <Input
          flex={1}
          size="$8"
          borderWidth={0}
          padding="$2"
          backgroundColor="transparent"
          placeholder={placeholder}
          placeholderTextColor="$textMuted"
          fontSize={"$2"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </XStack>

    </YStack>
  );
}