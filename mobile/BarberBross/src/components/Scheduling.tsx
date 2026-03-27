import { Button, Text, YStack, Image, XStack } from "tamagui";
import Calendar from "../components/Calendar";
import SelectProfessional from "./SelectProfessional";
import { useEffect, useState } from "react";

type Service = {
  id: string;
  desc: string;
  duracao: number;
  valor: number;
  image: any;
};

type Professionals = {
  id: string;
  nome: string;
  desc: string;
  social: any,
  image: any;
};

type Props = {
  service: Service | null;
  onClose: () => void;
};

export default function Scheduling({ service, onClose }: Props) {
  if (!service) return null;

  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const canConfirm = selectedProfessional && selectedDate && selectedTime;

  function loadTimes(professionalId: string, date: Date) {
    const horarios = [
      "09:00", "09:30", "10:00",
      "10:30", "11:00", "14:00",
      "14:30", "15:00", "16:00",
      "16:30", "17:00", "17:30",
    ];
    setTimes(horarios);
  }

  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      loadTimes(selectedProfessional.id, selectedDate);
    }
  }, [selectedProfessional, selectedDate]);

  return (
    <YStack
      padding="$4"
      gap="$3"
      position="relative"
    >
      <Calendar onSelectDate={setSelectedDate} />

      <SelectProfessional selectedProfessional={selectedProfessional} onSelectProfessional={setSelectedProfessional} />

      {times.length > 0 && (
        <YStack gap="$2">
          <Text fontSize={"$5"} fontWeight="700">Horários disponíveis</Text>

          <XStack flexWrap="wrap" gap="$2" alignItems="center" justifyContent="space-between">
            {times.map((time) => {
              const isSelected = selectedTime === time;

              return (
                <Button
                  key={time}
                  size="$7"
                  onPress={() => setSelectedTime(time)}
                  backgroundColor={isSelected ? "$primarySoft" : "$backgroundSecondary"}
                  borderRadius={"$5"}
                  borderWidth={1}
                  borderColor={isSelected ? "$primary" : "$borderColor"}
                  pressStyle={{ scale: 0.99 }}
                >
                  <Text color={isSelected ? "white" : "$color"}>{time}</Text>
                </Button>
              );
            })}
          </XStack>
        </YStack>
      )}

      <Button
        disabled={!canConfirm}
        opacity={canConfirm ? 1 : 0.5}
        onPress={onClose}
        size="$9"
        backgroundColor="$primary"
        borderRadius="$6"
        pressStyle={{
          scale: 0.99,
          opacity: 0.9,
          backgroundColor: "$primaryHover",
        }}
      >
        <Text fontSize={"$4"} fontWeight={"900"} >
          Confirmar agendamento
        </Text>
      </Button>
    </YStack>
  );
}