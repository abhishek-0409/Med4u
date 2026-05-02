import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Clock3, Droplets, FlaskConical, Search } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { Loader } from "../../components/ui/Loader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { labService } from "../../services/lab.service";
import { colors } from "../../theme/colors";
import { radius, shadows, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { LabTest } from "../../types/user";
import { formatCurrency } from "../../utils/helpers";

export function BookTestScreen() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const items = await labService.getTests();
      setTests(items);
      setLoading(false);
    })();
  }, []);

  const filteredTests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return tests;
    }

    return tests.filter((item) => `${item.name} ${item.sampleType}`.toLowerCase().includes(query));
  }, [search, tests]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader
              eyebrow="Diagnostics"
              title="Book lab tests"
              subtitle="Certified sample collection with clear report timelines."
            />

            <View style={styles.searchBar}>
              <Search size={18} color={colors.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search lab tests"
                placeholderTextColor={colors.placeholder}
                style={styles.searchInput}
              />
            </View>

            <SectionTitle
              title="Popular Tests"
              subtitle={`${filteredTests.length} test${filteredTests.length === 1 ? "" : "s"} available`}
            />
          </View>
        }
        ListEmptyComponent={
          <AppCard style={styles.emptyCard}>
            <FlaskConical size={26} color={colors.primaryDark} />
            <Text style={styles.emptyTitle}>No tests found</Text>
            <Text style={styles.emptyText}>Try searching with a shorter test name.</Text>
          </AppCard>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.testIcon}>
                <FlaskConical size={22} color={colors.primaryDark} />
              </View>
              <View style={styles.testInfo}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description}>
                  Includes {item.sampleType.toLowerCase()} sample collection and digital report delivery.
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Droplets size={14} color={colors.primaryDark} />
                <Text style={styles.metaText}>{item.sampleType}</Text>
              </View>
              <View style={styles.metaPill}>
                <Clock3 size={14} color={colors.primaryDark} />
                <Text style={styles.metaText}>{item.reportTime}</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <AppButton
                title="Book Test"
                fullWidth={false}
                size="sm"
                onPress={() => Alert.alert("Booked", `${item.name} booked successfully.`)}
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
  headerContent: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  searchBar: {
    minHeight: 54,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.text,
  },
  card: {
    gap: spacing.sm,
  },
  cardTop: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  testIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  testInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...typography.bodyBold,
  },
  description: {
    ...typography.caption,
    color: colors.label,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
  },
  metaText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  price: {
    ...typography.title,
    color: colors.primaryDark,
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
