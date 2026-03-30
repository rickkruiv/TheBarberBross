import { router } from "expo-router"
import { useState, useRef } from "react"
import { YStack, XStack, Text } from "tamagui"
import { ArrowLeft } from "@tamagui/lucide-icons-2"
import MapViewComponent from "../components/MapViewComponent"

import FilterButton from "../components/FilterButton"
import SearchBar from "../components/SearchBar"

export default function Search() {
  const [selectedFilter, setSelectedFilter] = useState("Name")
  const inputRef = useRef<any>(null)
  const isMapMode = selectedFilter === "SearchOnMap"

  return (
    <YStack flex={1} backgroundColor="$background">

      <YStack paddingHorizontal="$4" gap="$3">
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

        {!isMapMode && <SearchBar ref={inputRef} autoFocus />}

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
            active={isMapMode}
            onPress={() => {
              inputRef.current?.blur()
              setSelectedFilter("SearchOnMap")
            }}
          />
        </XStack>
      </YStack>

      {isMapMode ? (
        <MapViewComponent />
      ) : (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text color="$textMuted" fontSize="$3">
            Nenhum resultado encontrado
          </Text>
        </YStack>
      )}

    </YStack>
  )
}
