import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type props = {
  text: String;
  active: boolean;
  onPress?: () => void;
}

export default function FilterButton({ text, active, onPress }: props) {
  const { colors } = useTheme();

  return (
    <Pressable 
      onPress={onPress}
      style={[styles.container, ( active ? { backgroundColor: colors.primarySoft, borderColor: colors.primary } 
                                         : { backgroundColor: colors.backgroundSecondary, borderColor: colors.border })]}>
      <Text style={{ color: colors.text }}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1, 
    borderRightWidth: 1,
    borderRadius: 20,
  }
})