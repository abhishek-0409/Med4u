import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { FileCheck2, FlaskConical } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { Loader } from "../../components/ui/Loader";
import { labService } from "../../services/lab.service";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { LabReport } from "../../types/user";

export function ReportsScreen() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await labService.getReports();
      setReports(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <AppHeader
            eyebrow="Reports"
            title="Your lab reports"
            subtitle="Track processing reports and access completed results."
            style={styles.header}
          />
        }
        ListEmptyComponent={
          <AppCard style={styles.emptyCard}>
            <FlaskConical size={26} color={colors.primaryDark} />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptyText}>Booked lab test reports will appear here.</Text>
          </AppCard>
        }
        renderItem={({ item }) => {
          const isReady = item.status === "Ready";
          return (
            <AppCard style={styles.card}>
              <View style={styles.headerRow}>
                <View style={styles.reportIcon}>
                  <FileCheck2 size={20} color={colors.primaryDark} />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.name}>{item.testName}</Text>
                  <Text style={styles.meta}>Requested by {item.doctorName}</Text>
                  <Text style={styles.meta}>{item.date}</Text>
                </View>
                <View style={[styles.status, isReady ? styles.statusReady : styles.statusProcessing]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <AppButton
                title={isReady ? "View Report" : "Processing"}
                variant={isReady ? "outline" : "ghost"}
                disabled={!isReady}
              />
            </AppCard>
          );
        }}
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
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  reportInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.bodyBold,
  },
  meta: {
    ...typography.caption,
  },
  status: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  statusReady: {
    backgroundColor: "#E5F8EF",
  },
  statusProcessing: {
    backgroundColor: "#FFF3DF",
  },
  statusText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
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
