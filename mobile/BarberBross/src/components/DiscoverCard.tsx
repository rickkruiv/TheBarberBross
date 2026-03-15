import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

const data = [
  {
    id: "1",
    image: "https://lh3.googleusercontent.com/p/AF1QipO4Gwre9HyDZ8zSh9EiwDbXT4r1NZdEiGoM3WDK=s1360-w1360-h1020",
    open: true,
    openingHours: "09:00 - 19:00",
    name: "Mr. Chavozo",
    distance: '0.1Km',
  },
  {
    id: "2",
    image: "https://lh3.googleusercontent.com/p/AF1QipM5QRKMs6v8GO9WvPpWMREI_gCuL8dYhUjAr1IH=s1360-w1360-h1020",
    open: true,
    openingHours: "9:30 - 19:30",
    name: "Sr. Calixto",
    distance: '4.1Km',
  },
  {
    id: "3",
    image: "https://lh3.googleusercontent.com/p/AF1QipO1LyyYKrNkR1UJbtBJNsFJuO24JK7FP3eAGZBR=s1360-w1360-h1020",
    open: true,
    openingHours: "09:00 - 19:00",
    name: "Dom Jorge",
    distance: '1.3Km',
  },
  {
    id: "4",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwer3ph60ItX6zGE7M-_2-6HY9nqkiE3mp1s-3oZvhgCDUMKjhldpDXJMRNKf4XOpXrlBGCTta4nkpyEUjZv7KVusoyLtzPBrXk4MYoWQpwpQoBAdTyi2OdxUwY5Zv903r_aM7AFz=s1360-w1360-h1020",
    open: false,
    openingHours: "10:00 - 20:00",
    name: "Barbearia do Menezes",
    distance: '0.02Km',
  },
]

export default function DiscoverCard() {
  const { colors, typography } = useTheme();

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (

        <View style={[styles.card, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          <Image
            source={item.image}
            style={styles.image}
            contentFit="cover"
          />

          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={[typography.caption, { color: item.open ? colors.success : colors.error }]}>{item.open ? "OPEN NOW" : "CLOSED"}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{item.openingHours}</Text>
            </View>

            <Text style={[typography.subtitle, { color: colors.text }]}>{item.name}</Text>
            <View style={[styles.distanceChip]}>
              <Ionicons name="location-sharp" size={12} color={colors.textMuted} />
              <Text style={[typography.caption, { color: colors.textMuted }]}>{item.distance}</Text>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 250,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    gap: 4,
    padding: 12,
  },
  info: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 3,
    gap: 4,
  },
})