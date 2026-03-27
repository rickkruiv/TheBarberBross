import { router } from "expo-router"
import { useState, useRef } from "react"
import { YStack, XStack, Text } from "tamagui"
import { ArrowLeft } from "@tamagui/lucide-icons-2"

import FilterButton from "../components/FilterButton"
import SearchBar from "../components/SearchBar"

export default function Search() {
  const [selectedFilter, setSelectedFilter] = useState("Name")
  const inputRef = useRef<any>(null)

  return (
    <YStack flex={1} paddingHorizontal="$4" backgroundColor="$background">

      <YStack gap="$3">
        <XStack
          paddingVertical="$4"
          alignItems="center"
          gap="$3"
          onPress={() => router.back()}
        >
          <ArrowLeft size={18} color="$text" />
          <Text fontSize="$6" fontWeight="700" color="$text">
            Voltar
          </Text>
        </XStack>
        <SearchBar ref={inputRef} autoFocus />

        <XStack gap="$2" flexWrap="wrap">
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
              inputRef.current?.blur()
              setSelectedFilter("Nearby")
            }}
          />

          <FilterButton
            text="Search on map"
            active={selectedFilter === "SearchOnMap"}
            onPress={() => {
              inputRef.current?.blur()
              setSelectedFilter("SearchOnMap")
            }}
          />
        </XStack>

      </YStack>
    </YStack>
  )
}