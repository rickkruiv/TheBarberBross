import { Input, Text, useTheme, XStack, YStack } from "tamagui";
import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useState } from "react";
import { Pressable } from "react-native";

type Props = {
  label: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;

  secureTextEntry?: boolean;
  onIconPress?: () => void;
  error?: string;
  disabled?: boolean;
  keyboardType?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

const InputParts = forwardRef<any, Props>(({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry,
  onIconPress,
  error,
  disabled,
  keyboardType,
  autoCapitalize = "none",
}, ref) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? "$error" : focused ? "$primary" : "$border";
  const backgroundColor = focused ? "#613c4c4f" : "$backgroundSecondary";
  const labelColor = error ? "$error" : "$text";

  return (
    <YStack>

      <Text
        color={labelColor}
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
        borderColor={borderColor}
        alignItems="center"
        gap="$2"
        backgroundColor={backgroundColor}
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
          fontSize={"$3"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {onIconPress && (
          <Pressable onPress={onIconPress}>
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
              size={22}
              color={theme.textSecondary?.val}
            />
          </Pressable>
        )}
      </XStack>
      {error && (
        <Text color="$red10" fontSize="$2">
          {error}
        </Text>
      )}
    </YStack>
  );
})

export default InputParts;