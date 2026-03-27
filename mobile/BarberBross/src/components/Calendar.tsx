import { ScrollView, Pressable } from "react-native";
import { XStack, YStack, Text } from "tamagui";
import { useEffect, useRef, useState } from "react";

type Props = {
  onSelectDate?: (date: Date) => void;
};

function generateDays(numWeeks = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  const totalDays = numWeeks * 7;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return { weeks, start: today };
}
export default function Calendar({ onSelectDate }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [visibleMonth, setVisibleMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [containerWidth, setContainerWidth] = useState(0);

  const { weeks, start } = generateDays(20);
  const scrollRef = useRef<ScrollView>(null);

  function handleScrollEnd(e) {
    const offsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / containerWidth);
    const firstDayOfWeek = weeks[pageIndex][0];
    setVisibleMonth(firstDayOfWeek);
  }

  return (
    <>
      <Text fontSize={"$5"} textAlign="center" color={"$text"} fontWeight={"700"} >
        {visibleMonth.toLocaleDateString("en", {
          month: "long",
          year: "numeric",
        })}
      </Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        nestedScrollEnabled
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {weeks.map((week, weekIndex) => (
          <XStack key={weekIndex} width={containerWidth} justifyContent="space-between">
            {week.map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();

              return (
                <YStack key={index} alignItems="center" gap="$2" flex={1}>
                  <Text color={"$textSecondary"}>
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </Text>

                  <Pressable onPress={() => { setSelectedDate(date); onSelectDate?.(date); }} style={{ padding: 4 }} >
                    <YStack
                      width={40}
                      height={40}
                      aspectRatio={1}
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="$6"
                      backgroundColor={isSelected ? "$primarySoft" : "$backgroundSecondary"}
                      borderWidth={isSelected ? 2 : 1}
                      borderColor={isSelected ? "$primary" : "$backgroundSecondary"}
                    >
                      <Text fontSize="$4" fontWeight="700" color={isSelected ? "white" : "$text"}>
                        {date.getDate()}
                      </Text>
                    </YStack>
                  </Pressable>
                </YStack>
              );
            })}
          </XStack>
        ))}
      </ScrollView>
    </>
  );
}
