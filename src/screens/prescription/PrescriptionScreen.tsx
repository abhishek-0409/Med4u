import React from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { CalendarDays, Download, Eye, FileText, Pill } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export function PrescriptionScreen() {
  const prescriptions = useUserStore((state) => state.prescriptions);

  return (
    <View style={styles.container}>
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <AppHeader
            eyebrow="Records"
            title="Prescriptions"
            subtitle="Review medicines, dosage and doctor instructions."
            style={styles.header}
          />
        }
        ListEmptyComponent={
          <AppCard style={styles.emptyCard}>
            <FileText size={26} color={colors.primaryDark} />
            <Text style={styles.emptyTitle}>No prescriptions yet</Text>
            <Text style={styles.emptyText}>Your doctor prescriptions will appear here after consultation.</Text>
          </AppCard>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.fileIcon}>
                <FileText size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={styles.title}>{item.diagnosis}</Text>
                <Text style={styles.doctor}>{item.doctorName}</Text>
              </View>
              <View style={styles.datePill}>
                <CalendarDays size={13} color={colors.primaryDark} />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.medicineList}>
              {item.medicines.map((medicine) => (
                <View key={`${item.id}_${medicine.name}`} style={styles.medicineItem}>
                  <View style={styles.pillIcon}>
                    <Pill size={14} color={colors.primaryDark} />
                  </View>
                  <View style={styles.medicineCopy}>
                    <Text style={styles.medName}>{medicine.name}</Text>
                    <Text style={styles.medMeta}>
                      {medicine.dosage} | {medicine.duration}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <AppButton
                title="View"
                variant="outline"
                fullWidth={false}
                size="sm"
                leftIcon={<Eye size={16} color={colors.primaryDark} />}
                onPress={() => Alert.alert("Prescription", `${item.diagnosis} by ${item.doctorName}`)}
              />
              <AppButton
                title="Download"
                fullWidth={false}
                size="sm"
                leftIcon={<Download size={16} color={colors.white} />}
                onPress={() => Alert.alert("Download", "Prescription download will be available soon.")}
              />
            </View>
          </AppCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xs,
  },
  card: {
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodyBold,
  },
  doctor: {
    ...typography.caption,
    color: colors.label,
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
  },
  dateText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  medicineList: {
    gap: spacing.xs,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  pillIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  medicineCopy: {
    flex: 1,
    gap: 2,
  },
  medName: {
    ...typography.bodyBold,
  },
  medMeta: {
    ...typography.caption,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.xs,
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
});
