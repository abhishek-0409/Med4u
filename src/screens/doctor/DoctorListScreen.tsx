import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Search } from "lucide-react-native";
import { DoctorCard } from "../../components/doctor/DoctorCard";
import { Loader } from "../../components/ui/Loader";
import { doctorService } from "../../services/doctor.service";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
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
    (async () => {
      const data = await doctorService.getDoctors(activeCategory);
      setDoctors(data);
      setLoading(false);
    })();
  }, [activeCategory]);

  const filteredDoctors = useMemo(() => {
    if (!search.trim()) {
      return doctors;
    }
    return doctors.filter((item) =>
      `${item.name} ${item.specialization}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [doctors, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by doctor or specialty"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
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

      {filteredDoctors.length === 0 ? (
        <Text style={styles.empty}>No doctors found for this filter.</Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              variant="list"
              onPress={() => navigation.navigate("DoctorDetail", { doctorId: item.id })}
              onBookNow={() => navigation.navigate("BookDoctor", { doctorId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  searchBar: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  filterList: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterText: {
    ...typography.caption,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  empty: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
