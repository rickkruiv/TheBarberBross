import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../theme/ThemeProvider';

const data = {
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6pnWIg8ieDPCXAuLnryBmdB_E2BoZXJ1mjw&s",
  name: "Mr. Chavozo",
  service: "Haircut",
}

export default function LatestVisitCard() {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.textSecondary }]}>
      <Image
        source={data.image}
        style={{ width: 50, height: 50, borderRadius: 12 }}
      />

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[typography.subtitle, { color: colors.textInverse }]}>{data.name}</Text>
          <View style={styles.service}>
            <Text style={[typography.caption, { color: colors.textSecundaryInverse, fontWeight: 'bold' }]}>{data.service}</Text>
          </View>
        </View>
        <Pressable style={[styles.button, { backgroundColor: colors.background }]}>
          <Text style={[typography.body, { color: colors.text, fontWeight: 'bold' }]}>Book</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 70,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12
  },
  info: {
    flex: 1
  },
  service: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  }
});