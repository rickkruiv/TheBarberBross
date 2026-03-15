import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import FilterButton from "../components/FilterButton";
import { useState, useRef } from "react";
import SearchBar from "../components/SearchBar";

export default function Search() {
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("Name");
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View>
        <Pressable onPress={() => router.back()} style={styles.header}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
          <Text style={[{ fontSize: 20, fontWeight: 'bold', color: colors.text }]}>Voltar</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar ref={inputRef} autoFocus />

        <View style={styles.filter}>
          <FilterButton
            text="Name"
            active={selectedFilter === "Name"}
            onPress={() => setSelectedFilter("Name")}
          />
          <FilterButton
            text="City"
            active={selectedFilter === "City"}
            onPress={() => setSelectedFilter("City")}
          />
          <FilterButton
            text="Nearby"
            active={selectedFilter === "Nearby"}
            onPress={() => {
              inputRef.current?.blur();
              setSelectedFilter("Nearby")
            }}
          />
          <FilterButton
            text="Search on map"
            active={selectedFilter === "SearchOnMap"}
            onPress={() => {
              inputRef.current?.blur();
              setSelectedFilter("SearchOnMap")
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
});