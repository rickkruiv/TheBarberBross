import { View, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef } from 'react';

type props = {
  onFocus?: () => void;
  autoFocus: boolean;
}

const SearchBar = forwardRef<TextInput, props>(({ onFocus, autoFocus }, ref) =>  {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary , borderColor: colors.divider}]}>
      <Ionicons name="search" size={20} color={colors.textMuted} />

      <TextInput
        ref={ref}
        autoFocus={autoFocus}
        placeholder='Search'
        placeholderTextColor={colors.textMuted}
        onFocus={onFocus}
        style={[styles.input, typography.body, { color: colors.text }]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRightWidth: 1,
    gap: 5,
  },
  input: {
    width: '100%',
  },
})

export default SearchBar;