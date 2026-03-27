import { XStack, Text } from "tamagui";

type props = {
  text: String;
  active: boolean;
  onPress?: () => void;
}

export default function FilterButton({ text, active, onPress }: props) {

  return (
    <XStack
      onPress={onPress}
      paddingVertical="$1"
      paddingHorizontal="$3"
      borderWidth={1}
      borderRadius="$6"
      borderColor={active ? "$primary" : "$border"}
      pressStyle={{ scale: 0.95 }}
      backgroundColor={active ? "$primarySoft" : "transparent"}
    >
      <Text
        color={active ? "$primary" : "$text"}
      >
        {text}
      </Text>
    </XStack>
  );
}