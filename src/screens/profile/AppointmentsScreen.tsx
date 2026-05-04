import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarClock } from "lucide-react-native";
import { AppointmentCard } from "../../components/doctor/AppointmentCard";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { MainStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<MainStackParamList, "Appointments">;

export function AppointmentsScreen({}: Props) {
  const appointments = useUserStore((state) => state.appointments);

  return (
    <FlatList
      data={appointments}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        appointments.length === 0 && styles.centeredContent,
      ]}
      ListHeaderComponent={
        <AppHeader
          eyebrow="History"
          title="My Appointments"
          subtitle={
            appointments.length
              ? `${appointments.length} appointment${appointments.length === 1 ? "" : "s"} booked`
              : "Your upcoming and past consultations"
          }
        />
      }
      ListEmptyComponent={
        <AppCard style={styles.emptyCard}>
          <CalendarClock size={32} color={colors.primaryDark} />
          <Text style={styles.emptyTitle}>No appointments yet</Text>
          <Text style={styles.emptyText}>
            Book a consultation with a doctor and it will appear here.
          </Text>
        </AppCard>
      }
      renderItem={({ item }) => <AppointmentCard appointment={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centeredContent: {
    flexGrow: 1,
  },
  emptyCard: {
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  emptyTitle: {
    ...typography.bodyBold,
  },
  emptyText: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textSubtle,
  },
  separator: {
    height: spacing.sm,
  },
});
