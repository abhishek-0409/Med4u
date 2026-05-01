import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { CalendarDays, Clock4, Video } from "lucide-react-native";
import { Appointment } from "../../types/doctor";
import { colors } from "../../theme/colors";
import { radius, shadows, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: appointment.doctorImage }} style={styles.avatar} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderColor: colors.border,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    ...shadows.soft,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
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
    borderRadius: radius.pill,
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
    borderRadius: radius.pill,
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
