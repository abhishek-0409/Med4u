import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, Clock3 } from "lucide-react-native";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import { doctorService } from "../../services/doctor.service";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { Doctor, TimeSlot } from "../../types/doctor";
import { MainStackParamList } from "../../types/navigation";
import { formatCurrency } from "../../utils/helpers";

type Props = NativeStackScreenProps<MainStackParamList, "BookDoctor">;

export function BookDoctorScreen({ navigation, route }: Props) {
  const [doctor, setDoctor] = useState<Doctor | undefined>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<"Morning" | "Afternoon" | "Evening">(
    "Afternoon",
  );
  const addAppointment = useUserStore((state) => state.addAppointment);

  useEffect(() => {
    (async () => {
      const [doctorData, slotData] = await Promise.all([
        doctorService.getDoctorById(route.params.doctorId),
        doctorService.getSlots(route.params.doctorId),
      ]);
      setDoctor(doctorData);
      setSlots(slotData);
    })();
  }, [route.params.doctorId]);

  const upcomingDates = useMemo(() => {
    return Array.from({ length: 6 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date;
    });
  }, []);

  if (!doctor) {
    return <Loader />;
  }

  const filteredSlots = slots.filter((slot) => slot.period === activeShift);

  const onConfirm = () => {
    if (!selectedSlot) {
      Alert.alert("Select time", "Please choose an available slot.");
      return;
    }
    addAppointment({
      id: `ap_${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorImage: doctor.image,
      date: upcomingDates[selectedDate].toDateString(),
      time: selectedSlot,
      mode: "Video",
      status: "Upcoming",
    });
    Alert.alert("Booked", "Your appointment is confirmed.");
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <CalendarDays size={16} color={colors.primaryDark} />
        <Text style={styles.headerTitle}>Choose Date</Text>
      </View>

      <FlatList
        horizontal
        data={upcomingDates}
        keyExtractor={(item) => item.toISOString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateList}
        renderItem={({ item, index }) => {
          const active = selectedDate === index;
          return (
            <Pressable
              onPress={() => setSelectedDate(index)}
              style={[styles.dateItem, active && styles.dateItemActive]}
            >
              <Text style={[styles.dateDay, active && styles.dateDayActive]}>
                {item.toLocaleDateString("en-US", { weekday: "short" })}
              </Text>
              <Text style={[styles.dateNum, active && styles.dateNumActive]}>{item.getDate()}</Text>
            </Pressable>
          );
        }}
      />

      <View style={styles.headerCard}>
        <Clock3 size={16} color={colors.primaryDark} />
        <Text style={styles.headerTitle}>Choose Times</Text>
      </View>

      <View style={styles.shiftRow}>
        {(["Morning", "Afternoon", "Evening"] as const).map((shift) => {
          const active = activeShift === shift;
          return (
            <Pressable
              key={shift}
              style={[styles.shiftChip, active && styles.shiftChipActive]}
              onPress={() => setActiveShift(shift)}
            >
              <Text style={[styles.shiftText, active && styles.shiftTextActive]}>{shift}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.slotGrid}>
        {filteredSlots.map((slot) => {
          const active = selectedSlot === slot.label;
          const disabled = !slot.available;
          return (
            <Pressable
              key={slot.id}
              disabled={disabled}
              onPress={() => setSelectedSlot(slot.label)}
              style={[
                styles.slotItem,
                active && styles.slotItemActive,
                disabled && styles.slotItemDisabled,
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  active && styles.slotTextActive,
                  disabled && styles.slotTextDisabled,
                ]}
              >
                {slot.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Consultation Fee</Text>
        <Text style={styles.summaryFee}>{formatCurrency(doctor.fee)}</Text>
      </View>

      <Button title="Book Appointment" onPress={onConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  headerTitle: {
    ...typography.title,
    fontSize: 16,
  },
  dateList: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  dateItem: {
    width: 70,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  dateItemActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  dateDay: {
    ...typography.caption,
  },
  dateDayActive: {
    color: colors.white,
  },
  dateNum: {
    ...typography.title,
    fontSize: 18,
  },
  dateNumActive: {
    color: colors.white,
  },
  shiftRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  shiftChip: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  shiftChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  shiftText: {
    ...typography.caption,
    color: colors.text,
  },
  shiftTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  slotItem: {
    minWidth: 92,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  slotItemActive: {
    backgroundColor: colors.aqua,
    borderColor: colors.primaryDark,
  },
  slotItemDisabled: {
    backgroundColor: colors.backgroundElevated,
  },
  slotText: {
    ...typography.caption,
    color: colors.text,
  },
  slotTextActive: {
    color: colors.primaryDark,
    fontWeight: "600",
  },
  slotTextDisabled: {
    color: colors.textSubtle,
  },
  summaryCard: {
    borderRadius: radius.md,
    backgroundColor: colors.mint,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    ...typography.bodyBold,
  },
  summaryFee: {
    ...typography.title,
    color: colors.primaryDark,
  },
});
