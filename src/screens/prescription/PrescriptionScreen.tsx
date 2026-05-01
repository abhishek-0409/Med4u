import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export function PrescriptionScreen() {
  const prescriptions = useUserStore((state) => state.prescriptions);

  return (
    <View style={styles.container}>
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.title}>{item.diagnosis}</Text>
            <Text style={styles.meta}>{item.doctorName}</Text>
            <Text style={styles.meta}>{item.date}</Text>
            <View style={styles.divider} />
            {item.medicines.map((medicine) => (
              <View key={`${item.id}_${medicine.name}`} style={styles.medicineItem}>
                <Text style={styles.medName}>{medicine.name}</Text>
                <Text style={styles.medMeta}>
                  {medicine.dosage} • {medicine.duration}
                </Text>
              </View>
            ))}
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
    paddingBottom: spacing.xxl,
  },
  card: {
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
  },
  meta: {
    ...typography.caption,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  medicineItem: {
    gap: 2,
  },
  medName: {
    ...typography.bodyBold,
  },
  medMeta: {
    ...typography.caption,
  },
});
