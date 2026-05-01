import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, MapPin, Star, Stethoscope } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
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
      <LinearGradient colors={["#8ECFCC", "#9ECFE0"]} style={styles.topCard}>
        <Image source={{ uri: doctor.image }} style={styles.image} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <View style={styles.row}>
            <Star size={14} color={colors.warning} />
            <Text style={styles.meta}>{doctor.rating.toFixed(1)}</Text>
            <Text style={styles.dot}>-</Text>
            <Text style={styles.meta}>{doctor.experienceYears} yrs exp</Text>
          </View>
          <View style={styles.row}>
            <MapPin size={14} color={colors.primaryDark} />
            <Text style={styles.meta} numberOfLines={1}>
              {doctor.location}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.whiteCard}>
        <Text style={styles.sectionTitle}>Doctor Biography</Text>
        <Text style={styles.aboutText}>{doctor.about}</Text>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Stethoscope size={14} color={colors.primaryDark} />
            <Text style={styles.metricText}>{doctor.experienceYears} years</Text>
          </View>
          <View style={styles.metricItem}>
            <CalendarDays size={14} color={colors.primaryDark} />
            <Text style={styles.metricText}>{doctor.patients} patients</Text>
          </View>
        </View>
      </View>

      <View style={styles.whiteCard}>
        <View style={styles.reviewTitleRow}>
          <Text style={styles.sectionTitle}>Schedules</Text>
          <Text style={styles.meta}>Oct 2026</Text>
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

        <Text style={styles.slotTitle}>Choose Time</Text>
        <View style={styles.slotRow}>
          {shiftSlots.length ? (
            shiftSlots.map((slot) => (
              <View key={slot.id} style={styles.slotChip}>
                <Text style={styles.slotText}>{slot.label}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.meta}>No slots in this shift.</Text>
          )}
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {doctor.reviews.slice(0, 2).map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewAuthor}>{review.author}</Text>
              <Text style={styles.reviewRating}>{review.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.feeCard}>
        <Text style={styles.feeTitle}>Consultation Fee</Text>
        <Text style={styles.feeAmount}>{formatCurrency(doctor.fee)}</Text>
      </Pressable>

      <View style={styles.actions}>
        <Button
          title="Book Appointment"
          onPress={() => navigation.navigate("BookDoctor", { doctorId: doctor.id })}
        />
        <Button
          title="Video Consult"
          variant="outline"
          onPress={() => navigation.navigate("VideoConsult", { doctorId: doctor.id })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  topCard: {
    borderRadius: radius.lg,
    padding: spacing.sm,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  image: {
    width: 104,
    height: 126,
    borderRadius: radius.md,
  },
  profileInfo: {
    flex: 1,
    gap: 5,
  },
  whiteCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  name: {
    ...typography.title,
    fontWeight: "700",
  },
  specialization: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  meta: {
    ...typography.caption,
    color: colors.text,
  },
  dot: {
    color: colors.textSubtle,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 16,
  },
  aboutText: {
    ...typography.caption,
    lineHeight: 18,
    color: colors.text,
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.mint,
  },
  metricText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  reviewTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    backgroundColor: colors.backgroundElevated,
    paddingVertical: spacing.xs,
    alignItems: "center",
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
  slotTitle: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  slotChip: {
    backgroundColor: colors.aqua,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  slotText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  reviewItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  reviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewAuthor: {
    ...typography.bodyBold,
  },
  reviewRating: {
    ...typography.caption,
    color: colors.warning,
  },
  reviewComment: {
    ...typography.caption,
    color: colors.text,
  },
  feeCard: {
    borderRadius: radius.md,
    backgroundColor: colors.mint,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeTitle: {
    ...typography.bodyBold,
  },
  feeAmount: {
    ...typography.title,
    color: colors.primaryDark,
  },
  actions: {
    gap: spacing.sm,
  },
});
