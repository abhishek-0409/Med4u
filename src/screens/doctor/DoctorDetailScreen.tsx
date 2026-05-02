import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, MapPin, Star, Stethoscope, UserRound, Users, Video } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { FallbackImage } from "../../components/ui/FallbackImage";
import { Loader } from "../../components/ui/Loader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { doctorService } from "../../services/doctor.service";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { Doctor } from "../../types/doctor";
import { MainStackParamList } from "../../types/navigation";
import { formatCurrency } from "../../utils/helpers";

type Props = NativeStackScreenProps<MainStackParamList, "DoctorDetail">;

export function DoctorDetailScreen({ navigation, route }: Props) {
  const [doctor, setDoctor] = useState<Doctor | undefined>();
  const [activeShift, setActiveShift] = useState<"Morning" | "Afternoon" | "Evening">(
    "Afternoon",
  );

  useEffect(() => {
    (async () => {
      const profile = await doctorService.getDoctorById(route.params.doctorId);
      setDoctor(profile);
    })();
  }, [route.params.doctorId]);

  if (!doctor) {
    return <Loader />;
  }

  const shiftSlots = doctor.slots
    .filter((slot) => slot.period === activeShift && slot.available)
    .slice(0, 4);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AppCard style={styles.profileCard}>
        <FallbackImage
          uri={doctor.image}
          style={styles.image}
          fallbackIcon={<UserRound size={44} color={colors.primaryDark} />}
          accessibilityLabel={`${doctor.name} profile picture`}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Star size={14} color={colors.warning} />
              <Text style={styles.metaPillText}>{doctor.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.metaPill}>
              <Stethoscope size={14} color={colors.primaryDark} />
              <Text style={styles.metaPillText}>{doctor.experienceYears} yrs</Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.primaryDark} />
            <Text style={styles.locationText} numberOfLines={2}>
              {doctor.location}
            </Text>
          </View>
        </View>
      </AppCard>

      <View style={styles.metricsRow}>
        <MetricItem icon={<Users size={16} color={colors.primaryDark} />} label="Patients" value={doctor.patients} />
        <MetricItem icon={<Star size={16} color={colors.warning} />} label="Rating" value={doctor.rating.toFixed(1)} />
        <MetricItem icon={<CalendarDays size={16} color={colors.primaryDark} />} label="Fee" value={formatCurrency(doctor.fee)} />
      </View>

      <AppCard style={styles.cardBlock}>
        <SectionTitle title="Doctor Biography" />
        <Text style={styles.aboutText}>{doctor.about}</Text>
      </AppCard>

      <AppCard style={styles.cardBlock}>
        <SectionTitle title="Available Schedule" subtitle="Choose a preferred time window" />
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

        <View style={styles.slotRow}>
          {shiftSlots.length ? (
            shiftSlots.map((slot) => (
              <View key={slot.id} style={styles.slotChip}>
                <Text style={styles.slotText}>{slot.label}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No slots in this shift.</Text>
          )}
        </View>
      </AppCard>

      <AppCard style={styles.cardBlock}>
        <SectionTitle title="Patient Reviews" subtitle="Recent verified feedback" />
        {doctor.reviews.slice(0, 2).map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewAuthor}>{review.author}</Text>
              <Text style={styles.reviewRating}>{review.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </AppCard>

      <AppCard style={styles.feeCard}>
        <View>
          <Text style={styles.feeTitle}>Consultation Fee</Text>
          <Text style={styles.feeSubtitle}>Video or clinic appointment</Text>
        </View>
        <Text style={styles.feeAmount}>{formatCurrency(doctor.fee)}</Text>
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          title="Book Appointment"
          leftIcon={<CalendarDays size={18} color={colors.white} />}
          onPress={() => navigation.navigate("BookDoctor", { doctorId: doctor.id })}
        />
        <AppButton
          title="Video Consult"
          variant="outline"
          leftIcon={<Video size={18} color={colors.primaryDark} />}
          onPress={() => navigation.navigate("VideoConsult", { doctorId: doctor.id })}
        />
      </View>
    </ScrollView>
  );
}

function MetricItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <AppCard style={styles.metricItem}>
      {icon}
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 132,
    borderRadius: radius.lg,
    backgroundColor: colors.border,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.h3,
  },
  specialization: {
    ...typography.body,
    color: colors.label,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
  },
  metaPillText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  locationText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xxs,
    padding: spacing.sm,
  },
  metricValue: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: "center",
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  cardBlock: {
    gap: spacing.sm,
  },
  aboutText: {
    ...typography.body,
    color: colors.text,
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
    backgroundColor: colors.backgroundElevated,
    paddingVertical: spacing.xs,
    alignItems: "center",
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  slotChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  slotText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  reviewItem: {
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xxs,
  },
  reviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  reviewAuthor: {
    ...typography.bodyBold,
  },
  reviewRating: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: "700",
  },
  reviewComment: {
    ...typography.caption,
    color: colors.text,
  },
  feeCard: {
    backgroundColor: colors.primaryLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  feeTitle: {
    ...typography.bodyBold,
  },
  feeSubtitle: {
    ...typography.caption,
    color: colors.label,
  },
  feeAmount: {
    ...typography.h3,
    color: colors.primaryDark,
  },
  actions: {
    gap: spacing.sm,
  },
});
