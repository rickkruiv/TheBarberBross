import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function HomeSection({ title, children }) {
  const { colors, typography } = useTheme();

  return (
    <>
      <Text style={[typography.body, { fontWeight: 'bold', color: colors.textSecondary }]}>
        {title}
      </Text>
      <View>
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
})