import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MapPin } from '@tamagui/lucide-icons-2';
import { XStack, YStack, Text } from 'tamagui';
import { useTheme } from 'tamagui';
import { formatDistance } from '../utils/format';

const data = [
  {
    id: "1",
    image: "https://lh3.googleusercontent.com/p/AF1QipO4Gwre9HyDZ8zSh9EiwDbXT4r1NZdEiGoM3WDK=s1360-w1360-h1020",
    open: true,
    openingHours: "09:00 - 19:00",
    name: "Mr. Chavozo",
    distance: 0.1,
  },
  {
    id: "2",
    image: "https://lh3.googleusercontent.com/p/AF1QipM5QRKMs6v8GO9WvPpWMREI_gCuL8dYhUjAr1IH=s1360-w1360-h1020",
    open: true,
    openingHours: "9:30 - 19:30",
    name: "Sr. Calixto",
    distance: 4.1,
  },
  {
    id: "3",
    image: "https://lh3.googleusercontent.com/p/AF1QipO1LyyYKrNkR1UJbtBJNsFJuO24JK7FP3eAGZBR=s1360-w1360-h1020",
    open: true,
    openingHours: "09:00 - 19:00",
    name: "Dom Jorge",
    distance: 1.3,
  },
  {
    id: "4",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwer3ph60ItX6zGE7M-_2-6HY9nqkiE3mp1s-3oZvhgCDUMKjhldpDXJMRNKf4XOpXrlBGCTta4nkpyEUjZv7KVusoyLtzPBrXk4MYoWQpwpQoBAdTyi2OdxUwY5Zv903r_aM7AFz=s1360-w1360-h1020",
    open: false,
    openingHours: "10:00 - 20:00",
    name: "Barbearia do Menezes",
    distance: 0.02,
  },
]

export default function DiscoverCard() {
  const theme = useTheme();

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (

        <Pressable
          onPress={() => router.push("/barberShop")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
        >
          <YStack
            width={180}
            height={250}
            borderRadius="$4"
            marginRight="$3"
            overflow="hidden"
            backgroundColor="$backgroundSecondary"
          >
            <Image
              source={item.image}
              style={styles.image}
              contentFit="cover"
            />

            <YStack padding="$3" gap="$2">
              <XStack gap="$2" alignItems="center">
                <Text
                  fontSize="$3"
                  color={item.open ? "$success" : "$error"}
                  fontWeight="600"
                >
                  {item.open ? "OPEN NOW" : "CLOSED"}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {item.openingHours}
                </Text>
              </XStack>

              <Text fontSize="$4" fontWeight="700" color="$text">{item.name}</Text>

              <XStack alignItems="center" gap="$2">
                <MapPin size={12} color={theme.textSecondary.val} />
                <Text fontSize="$3" color="$textSecondary">{formatDistance(item.distance)}</Text>
              </XStack>
            </YStack>
          </YStack>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 160,
  },
})