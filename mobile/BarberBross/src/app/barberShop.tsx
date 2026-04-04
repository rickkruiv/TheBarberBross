import { YStack, XStack, ScrollView, Text, Image, useTheme } from "tamagui";
import { LinearGradient } from '@tamagui/linear-gradient';
import { StarFull } from '@tamagui/lucide-icons-2';
import { useState } from "react";
import Details from "../components/BarberShop/Details";
import Services from "../components/BarberShop/Services";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import Scheduling from "../components/BarberShop/Scheduling";
import Professionals from "../components/BarberShop/Professionals";
import Products from "../components/BarberShop/Products";
import LoyaltyCard from "../components/BarberShop/LoyaltyCard";
import type { Service } from "../components/BarberShop/Services";

const data = {
  id: "2",
  image: "https://lh3.googleusercontent.com/p/AF1QipM5QRKMs6v8GO9WvPpWMREI_gCuL8dYhUjAr1IH=s1360-w1360-h1020",
  open: false,
  openingHours: "9:30 - 19:30",
  rating: "4.8",
  name: "Sr. Calixto",
  distance: '4.1Km',
  address: "Av. Gastão Vidigal, 1934 - Zona 08",
};

const tabs = ["Services", "Details", "Professionals", "Products", "Loyalty"];

export default function BarberShop() {
  const theme = useTheme();
  const [active, setActive] = useState("Services");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <>
      <ScrollView backgroundColor={"$background"}>

        <YStack position="relative">
          <Image
            src={data.image}
            width={"100%"}
            height={300}
            borderBottomRightRadius={14}
            borderBottomLeftRadius={14}
          />

          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            padding="$4"
            gap="$2"
            borderBottomRightRadius={14}
            borderBottomLeftRadius={14}
            backgroundColor={"$overlay"}
          >
            <LinearGradient
              width="$6"
              height="$1"
              colors={['$background', '$backgroundTransparent']}
              start={[0, 1]}
              end={[0, 0]}
            />
            <XStack
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize="$6" fontWeight="700" color="white">
                {data.name}
              </Text>
              <Text
                fontSize="$3"
                color={data.open ? "$success" : "$error"}
                fontWeight="600"
                backgroundColor={data.open ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}
                paddingHorizontal={"$2"}
                paddingVertical={"$1"}
                borderRadius={"$4"}
              >
                {data.open ? "OPEN NOW" : "CLOSED"}
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$1">
                <StarFull size={14} color="gold" />
                <Text color="white" fontWeight="600">
                  {data.rating}
                </Text>
              </XStack>

              <Text color="white" numberOfLines={1}>
                {data.address}
              </Text>
            </XStack>
          </YStack>
        </YStack>

        <YStack>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >

            <YStack>
              <XStack
                borderBottomWidth={1}
                borderColor="$border"
                paddingHorizontal="$4"
                gap="$5"
              >
                {tabs.map((tab) => {
                  const isActive = active === tab;
                  return (
                    <YStack key={tab} alignItems="center">
                      <Text
                        onPress={() => setActive(tab)}
                        fontSize="$3"
                        fontWeight="600"
                        color={isActive ? "$text" : "$textMuted"}
                        paddingVertical="$3"
                        pressStyle={{
                          opacity: 0.6
                        }}
                      >
                        {tab.toUpperCase()}
                      </Text>
                      {isActive && (
                        <YStack
                          height={3}
                          width="100%"
                          backgroundColor="$primary"
                          borderRadius="$2"
                        />
                      )}
                    </YStack>
                  );
                })}
              </XStack>
            </YStack>
          </ScrollView>

          <YStack padding="$4">
            {
              active === "Services" &&
              <Services
                onSelectService={(service) => {
                  setSelectedService(service);
                  bottomSheetRef.current?.expand();
                }}
              />
            }
            {
              active === "Details" &&
              <Details />
            }
            {
              active === "Professionals" &&
              <Professionals />
            }
            {
              active === "Products" &&
              <Products />
            }
            {
              active === "Loyalty" && (
                <YStack gap="$4">
                  <LoyaltyCard pontos={7} />
                </YStack>
              )
            }
          </YStack>
        </YStack>

      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '80%']}
        backgroundStyle={{ backgroundColor: theme.surface?.val }}
        enablePanDownToClose
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={{ flex: 1, padding: 8 }}>
          <Scheduling service={selectedService} onClose={() => bottomSheetRef.current?.close()} />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}