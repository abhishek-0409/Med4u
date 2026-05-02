import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Search, SlidersHorizontal, Stethoscope } from "lucide-react-native";
import { DoctorCard } from "../../components/doctor/DoctorCard";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { Loader } from "../../components/ui/Loader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { doctorService } from "../../services/doctor.service";
import { colors } from "../../theme/colors";
import { radius, shadows, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { Doctor } from "../../types/doctor";
import { MainStackParamList } from "../../types/navigation";
import { DOCTOR_CATEGORIES } from "../../utils/constants";

type Props = NativeStackScreenProps<MainStackParamList, "DoctorList">;

export function DoctorListScreen({ navigation, route }: Props) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(route.params?.category);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    setActiveCategory(route.params?.category);
  }, [route.params?.category]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    (async () => {
      const data = await doctorService.getDoctors(activeCategory);
      if (isMounted) {
        setDoctors(data);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return doctors;
    }

    return doctors.filter((item) =>
      `${item.name} ${item.specialization} ${item.category}`.toLowerCase().includes(query),
    );
  }, [doctors, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader
              eyebrow="Doctors"
              title="Find trusted specialists"
              subtitle="Compare ratings, fees and availability before you book."
              rightElement={
                <View style={styles.countCard}>
                  <Text style={styles.countValue}>{doctors.length}</Text>
                  <Text style={styles.countLabel}>listed</Text>
                </View>
              }
            />

            <View style={styles.searchBar}>
              <Search size={18} color={colors.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search doctor or specialty"
                placeholderTextColor={colors.placeholder}
                style={styles.searchInput}
              />
              <SlidersHorizontal size={18} color={colors.primaryDark} />
            </View>

            <FlatList
              data={["All", ...DOCTOR_CATEGORIES]}
              horizontal
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
              renderItem={({ item }) => {
                const selected = (item === "All" && !activeCategory) || activeCategory === item;
                return (
                  <Pressable
                    style={[styles.filterChip, selected && styles.filterChipActive]}
                    onPress={() => setActiveCategory(item === "All" ? undefined : item)}
                  >
                    <Text style={[styles.filterText, selected && styles.filterTextActive]}>{item}</Text>
                  </Pressable>
                );
              }}
            />

            <SectionTitle
              title={activeCategory ? `${activeCategory} doctors` : "Available doctors"}
              subtitle={`${filteredDoctors.length} match${filteredDoctors.length === 1 ? "" : "es"} found`}
            />
          </View>
        }
        ListEmptyComponent={
          <AppCard style={styles.emptyCard}>
            <Stethoscope size={26} color={colors.primaryDark} />
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptyText}>Try another category or a shorter search term.</Text>
          </AppCard>
        }
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            variant="list"
            onPress={() => navigation.navigate("DoctorDetail", { doctorId: item.id })}
            onBookNow={() => navigation.navigate("BookDoctor", { doctorId: item.id })}
          />
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
    gap: spacing.sm,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerContent: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  countCard: {
    minWidth: 74,
    minHeight: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  countValue: {
    ...typography.title,
    color: colors.primaryDark,
  },
  countLabel: {
    ...typography.caption,
    color: colors.textSubtle,
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
  filterList: {
    gap: spacing.xs,
    paddingRight: spacing.lg,
  },
  filterChip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.white,
  },
  emptyCard: {
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  emptyTitle: {
    ...typography.bodyBold,
  },
  emptyText: {
    ...typography.caption,
    textAlign: "center",
  },
});
