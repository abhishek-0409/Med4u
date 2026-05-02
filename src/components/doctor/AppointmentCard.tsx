import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CalendarDays, Clock4, UserRound, Video } from "lucide-react-native";
import { AppCard } from "../ui/AppCard";
import { FallbackImage } from "../ui/FallbackImage";
import { Appointment } from "../../types/doctor";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <AppCard style={styles.container}>
      <FallbackImage
        uri={appointment.doctorImage}
        style={styles.avatar}
        fallbackIcon={<UserRound size={24} color={colors.primaryDark} />}
        accessibilityLabel={`${appointment.doctorName} profile picture`}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{appointment.doctorName}</Text>
        <View style={styles.row}>
          <CalendarDays size={14} color={colors.secondary} />
          <Text style={styles.meta}>{appointment.date}</Text>
        </View>
        <View style={styles.row}>
          <Clock4 size={14} color={colors.secondary} />
          <Text style={styles.meta}>{appointment.time}</Text>
          {appointment.mode === "Video" && (
            <View style={styles.videoChip}>
              <Video size={12} color={colors.primaryDark} />
              <Text style={styles.videoText}>Video</Text>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.status, appointment.status === "Upcoming" ? styles.statusUpcoming : styles.statusDone]}>
        <Text style={styles.statusText}>{appointment.status}</Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
    gap: 4,
  },
  name: {
    ...typography.bodyBold,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  meta: {
    ...typography.caption,
  },
  videoChip: {
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.chip,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  videoText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  status: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  statusUpcoming: {
    backgroundColor: colors.chip,
  },
  statusDone: {
    backgroundColor: colors.backgroundElevated,
  },
  statusText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
});
