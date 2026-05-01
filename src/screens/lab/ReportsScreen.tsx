import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
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
        renderItem={({ item }) => (
          <Card>
            <View style={styles.header}>
              <Text style={styles.name}>{item.testName}</Text>
              <View
                style={[
                  styles.status,
                  item.status === "Ready" ? styles.statusReady : styles.statusProcessing,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.meta}>Requested by: {item.doctorName}</Text>
            <Text style={styles.meta}>Date: {item.date}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.bodyBold,
  },
  status: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    borderRadius: radius.pill,
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
  },
  meta: {
    ...typography.caption,
  },
});
