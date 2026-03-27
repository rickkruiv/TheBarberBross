import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { YStack, Text, ScrollView } from 'tamagui'
import SearchBar from '../../components/SearchBar';
import { getFormattedToday } from '../../utils/format';
import HomeSection from '../../components/HomeSection';
import LatestVisitCard from '../../components/LatestVisitCard'
import DiscoverCard from '../../components/DiscoverCard';

export default function Home() {
  const dateFormated = getFormattedToday();

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        gap: 15,
        paddingHorizontal: 20,
      }}
    >

      <YStack paddingTop={50}>
        <Text fontSize={'$9'} fontWeight={'bold'} color="$text">Hey, {'Thiago'}! </Text>
        <Text color="$textSecundary">{dateFormated}</Text>
      </YStack>

      <SearchBar onFocus={() => router.push('/search')} autoFocus={false} />

      <HomeSection title={'Latest visit'}>
        <LatestVisitCard />
      </HomeSection>

      <HomeSection title={'Discover'}>
        <DiscoverCard />
      </HomeSection>

      <StatusBar style="auto" />
    </ScrollView>
  );
}