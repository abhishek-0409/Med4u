import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, Star, UserRound, Users } from "lucide-react-native";
import { AppButton } from "../ui/AppButton";
import { AppCard } from "../ui/AppCard";
import { FallbackImage } from "../ui/FallbackImage";
import { Doctor } from "../../types/doctor";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { formatCurrency } from "../../utils/helpers";

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: () => void;
  onBookNow?: () => void;
  variant?: "featured" | "list";
}

export function DoctorCard({
  doctor,
  onPress,
  onBookNow,
  variant = "featured",
}: DoctorCardProps) {
  if (variant === "list") {
    return (
      <AppCard style={styles.listCard}>
        <Pressable style={({ pressed }) => [styles.listInfoWrap, pressed && styles.pressed]} onPress={onPress}>
          <FallbackImage
            uri={doctor.image}
            style={styles.listImage}
            fallbackIcon={<UserRound size={24} color={colors.primaryDark} />}
            accessibilityLabel={`${doctor.name} profile picture`}
          />
          <View style={styles.listInfo}>
            <Text style={styles.listName} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Text style={styles.listSpec} numberOfLines={1}>
              {doctor.specialization}
            </Text>
            <View style={styles.listMetaRow}>
              <Star size={13} color={colors.warning} />
              <Text style={styles.listMetaText}>{doctor.rating.toFixed(1)}</Text>
              <Text style={styles.listMetaDot}>|</Text>
              <Text style={styles.listMetaText}>{doctor.patients}</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.listRight}>
          <Text style={styles.feeCaption}>Fee</Text>
          <Text style={styles.listFee}>{formatCurrency(doctor.fee)}</Text>
          <AppButton
            title="Consult Now"
            fullWidth={false}
            size="sm"
            onPress={onBookNow ?? onPress}
          />
        </View>
      </AppCard>
    );
  }

  return (
    <AppCard style={styles.container} onPress={onPress}>
      <FallbackImage
        uri={doctor.image}
        style={styles.image}
        fallbackIcon={<UserRound size={52} color={colors.primaryDark} />}
        accessibilityLabel={`${doctor.name} profile picture`}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Star size={14} color={colors.warning} />
            <Text style={styles.metaText}>{doctor.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color={colors.secondary} />
            <Text style={styles.metaText}>{doctor.patients}</Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.primary} />
            <Text style={styles.metaText}>{doctor.experienceYears} yrs</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.feeCaption}>Consultation</Text>
            <Text style={styles.fee}>{formatCurrency(doctor.fee)}</Text>
          </View>
          <Text style={styles.location}>{doctor.location}</Text>
        </View>
        <AppButton
          title="Consult Now"
          size="sm"
          onPress={onBookNow ?? onPress}
          style={styles.featuredButton}
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    overflow: "hidden",
    padding: 0,
  },
  pressed: {
    opacity: 0.92,
  },
  image: {
    height: 190,
    width: "100%",
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
  },
  specialization: {
    ...typography.body,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  metaText: {
    ...typography.caption,
    color: colors.text,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  fee: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  location: {
    ...typography.caption,
    flex: 1,
    textAlign: "right",
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.sm,
  },
  listInfoWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginRight: spacing.sm,
  },
  listImage: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
  },
  listInfo: {
    flex: 1,
    gap: 2,
  },
  listName: {
    ...typography.bodyBold,
  },
  listSpec: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  listMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listMetaText: {
    ...typography.caption,
    color: colors.text,
  },
  listMetaDot: {
    color: colors.textSubtle,
    marginHorizontal: 1,
  },
  listRight: {
    alignItems: "flex-end",
    gap: 4,
    maxWidth: 116,
  },
  feeCaption: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  listFee: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  featuredButton: {
    marginTop: spacing.xs,
  },
});
