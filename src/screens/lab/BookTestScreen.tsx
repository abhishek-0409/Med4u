import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { labService } from "../../services/lab.service";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { LabTest } from "../../types/user";
import { formatCurrency } from "../../utils/helpers";

export function BookTestScreen() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const items = await labService.getTests();
      setTests(items);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.meta}>Sample: {item.sampleType}</Text>
            <Text style={styles.meta}>Report in: {item.reportTime}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <Button
                title="Book"
                fullWidth={false}
                onPress={() => Alert.alert("Booked", `${item.name} booked successfully.`)}
              />
            </View>
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
    ...typography.bodyBold,
  },
  meta: {
    ...typography.caption,
  },
  bottomRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    ...typography.title,
    color: colors.primaryDark,
  },
});
