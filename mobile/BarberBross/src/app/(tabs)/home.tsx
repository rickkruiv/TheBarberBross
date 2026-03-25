import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from "../../theme/ThemeProvider";
import { useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import { getFormattedToday } from '../../utils/date';
import HomeSection from '../../components/HomeSection';
import LatestVisitCard from '../../components/LatestVisitCard'
import DiscoverCard from '../../components/DiscoverCard';

export default function Home() {
  const { colors, typography, setThemeMode } = useTheme();
  const dateFormated = getFormattedToday();

  useEffect(() => {
    setThemeMode("system");
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>

      <View style={styles.greeting}>
        <Text style={[styles.greetingTitle, { color: colors.text }]}>Hey, {"Thiago"}!</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>{dateFormated}</Text>
      </View>

      <SearchBar onFocus={() => router.push('/search')} autoFocus={false} />

      <HomeSection title={'Latest visit'} children={<LatestVisitCard/>} />
      <HomeSection title={'Discover'} children={<DiscoverCard/>} />

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    gap: 15,
  },
  greeting: {
    paddingTop: 50,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  greetingTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRightWidth: 1,
    borderRadius: 10,
    padding: 20,
    width: '100%'
  }
});
