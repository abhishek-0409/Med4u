import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, Clock3, UserRound, Video } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { FallbackImage } from "../../components/ui/FallbackImage";
import { Loader } from "../../components/ui/Loader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { doctorService } from "../../services/doctor.service";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { Doctor, TimeSlot } from "../../types/doctor";
import { MainStackParamList } from "../../types/navigation";
import { formatCurrency } from "../../utils/helpers";

type Props = NativeStackScreenProps<MainStackParamList, "BookDoctor">;

const DEFAULT_SLOTS: TimeSlot[] = [
  { id: "ds-m1", label: "09:00 AM", period: "Morning", available: true },
  { id: "ds-m2", label: "09:30 AM", period: "Morning", available: true },
  { id: "ds-m3", label: "10:00 AM", period: "Morning", available: false },
  { id: "ds-m4", label: "10:30 AM", period: "Morning", available: true },
  { id: "ds-m5", label: "11:00 AM", period: "Morning", available: true },
  { id: "ds-a1", label: "12:30 PM", period: "Afternoon", available: true },
  { id: "ds-a2", label: "01:00 PM", period: "Afternoon", available: true },
  { id: "ds-a3", label: "02:00 PM", period: "Afternoon", available: false },
  { id: "ds-a4", label: "03:00 PM", period: "Afternoon", available: true },
  { id: "ds-a5", label: "03:30 PM", period: "Afternoon", available: true },
  { id: "ds-e1", label: "05:00 PM", period: "Evening", available: true },
  { id: "ds-e2", label: "05:30 PM", period: "Evening", available: true },
  { id: "ds-e3", label: "06:00 PM", period: "Evening", available: false },
  { id: "ds-e4", label: "06:30 PM", period: "Evening", available: true },
  { id: "ds-e5", label: "07:00 PM", period: "Evening", available: true },
];

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
      setSlots(slotData.length > 0 ? slotData : DEFAULT_SLOTS);
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
      <FlatList
        data={filteredSlots}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader
              eyebrow="Appointment"
              title="Pick your consultation slot"
              subtitle="Choose a date and available video consult time."
            />

            <AppCard style={styles.doctorCard}>
              <FallbackImage
                uri={doctor.image}
                style={styles.doctorImage}
                fallbackIcon={<UserRound size={26} color={colors.primaryDark} />}
                accessibilityLabel={`${doctor.name} profile picture`}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorMeta}>{doctor.specialization}</Text>
                <Text style={styles.doctorPrice}>{formatCurrency(doctor.fee)}</Text>
              </View>
              <View style={styles.modePill}>
                <Video size={14} color={colors.primaryDark} />
                <Text style={styles.modeText}>Video</Text>
              </View>
            </AppCard>

            <SectionTitle title="Choose Date" />
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
                    <Text style={[styles.dateDay, active && styles.dateTextActive]}>
                      {item.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                    <Text style={[styles.dateNum, active && styles.dateTextActive]}>{item.getDate()}</Text>
                  </Pressable>
                );
              }}
            />

            <SectionTitle title="Choose Time" subtitle="Available slots are highlighted" />
            <View style={styles.shiftRow}>
              {(["Morning", "Afternoon", "Evening"] as const).map((shift) => {
                const active = activeShift === shift;
                return (
                  <Pressable
                    key={shift}
                    style={[styles.shiftChip, active && styles.shiftChipActive]}
                    onPress={() => {
                      setActiveShift(shift);
                      setSelectedSlot(null);
                    }}
                  >
                    <Text style={[styles.shiftText, active && styles.shiftTextActive]}>{shift}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <AppCard style={styles.emptyCard}>
            <Clock3 size={24} color={colors.primaryDark} />
            <Text style={styles.emptyTitle}>No slots available</Text>
            <Text style={styles.emptyText}>Try another time window for this doctor.</Text>
          </AppCard>
        }
        renderItem={({ item }) => {
          const active = selectedSlot === item.label;
          const disabled = !item.available;

          return (
            <Pressable
              disabled={disabled}
              onPress={() => setSelectedSlot(item.label)}
              style={[
                styles.slotItem,
                active && styles.slotItemActive,
                disabled && styles.slotItemDisabled,
              ]}
            >
              <Clock3 size={15} color={active ? colors.white : colors.primaryDark} />
              <Text
                style={[
                  styles.slotText,
                  active && styles.slotTextActive,
                  disabled && styles.slotTextDisabled,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        }}
        numColumns={2}
        columnWrapperStyle={styles.slotRow}
      />

      <AppCard style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Consultation Fee</Text>
          <Text style={styles.summaryMeta}>
            {selectedSlot ? `Selected ${selectedSlot}` : "Select a slot to continue"}
          </Text>
        </View>
        <Text style={styles.summaryFee}>{formatCurrency(doctor.fee)}</Text>
        <AppButton
          title="Book Appointment"
          leftIcon={<CalendarDays size={18} color={colors.white} />}
          onPress={onConfirm}
        />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 188,
    gap: spacing.sm,
  },
  headerContent: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  doctorImage: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
  },
  doctorInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  doctorName: {
    ...typography.bodyBold,
  },
  doctorMeta: {
    ...typography.caption,
  },
  doctorPrice: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  modePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
  },
  modeText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  dateList: {
    gap: spacing.xs,
    paddingRight: spacing.lg,
  },
  dateItem: {
    width: 70,
    minHeight: 78,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  dateItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateDay: {
    ...typography.caption,
  },
  dateNum: {
    ...typography.title,
    fontSize: 18,
  },
  dateTextActive: {
    color: colors.white,
  },
  shiftRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  shiftChip: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  shiftChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  shiftText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "600",
  },
  shiftTextActive: {
    color: colors.white,
  },
  slotRow: {
    gap: spacing.sm,
  },
  slotItem: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  slotItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotItemDisabled: {
    backgroundColor: colors.backgroundElevated,
    opacity: 0.55,
  },
  slotText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "700",
  },
  slotTextActive: {
    color: colors.white,
  },
  slotTextDisabled: {
    color: colors.textSubtle,
  },
  emptyCard: {
    alignItems: "center",
    gap: spacing.xs,
  },
  emptyTitle: {
    ...typography.bodyBold,
  },
  emptyText: {
    ...typography.caption,
    textAlign: "center",
  },
  summaryCard: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    gap: spacing.sm,
  },
  summaryLabel: {
    ...typography.bodyBold,
  },
  summaryMeta: {
    ...typography.caption,
  },
  summaryFee: {
    ...typography.h3,
    color: colors.primaryDark,
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
  },
});
