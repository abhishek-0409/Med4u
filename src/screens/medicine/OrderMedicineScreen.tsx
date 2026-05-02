import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PackagePlus, Pill, Search, ShoppingCart } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { FallbackImage } from "../../components/ui/FallbackImage";
import { AppHeader } from "../../components/ui/AppHeader";
import { Loader } from "../../components/ui/Loader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { medicineService } from "../../services/medicine.service";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, shadows, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { MainStackParamList } from "../../types/navigation";
import { Medicine } from "../../types/user";
import { formatCurrency } from "../../utils/helpers";

type Props = NativeStackScreenProps<MainStackParamList, "OrderMedicine">;

export function OrderMedicineScreen({ navigation }: Props) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const addToCart = useUserStore((state) => state.addToCart);
  const cartCount = useUserStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0));

  useEffect(() => {
    (async () => {
      const data = await medicineService.getMedicines();
      setMedicines(data);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(medicines.map((item) => item.category)))];
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    const query = search.trim().toLowerCase();

    return medicines.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = !query || `${item.name} ${item.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, medicines, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader
              eyebrow="Pharmacy"
              title="Order genuine medicines"
              subtitle="Browse essentials and add them to your cart."
              rightElement={
                <Pressable style={styles.cartMini} onPress={() => navigation.navigate("Cart")}>
                  <ShoppingCart size={18} color={colors.primaryDark} />
                  <Text style={styles.cartMiniText}>{cartCount}</Text>
                </Pressable>
              }
            />

            <View style={styles.searchBar}>
              <Search size={18} color={colors.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search medicines"
                placeholderTextColor={colors.placeholder}
                style={styles.searchInput}
              />
            </View>

            <FlatList
              data={categories}
              horizontal
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => {
                const selected = activeCategory === item;
                return (
                  <Pressable
                    style={[styles.categoryChip, selected && styles.categoryChipActive]}
                    onPress={() => setActiveCategory(item)}
                  >
                    <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>{item}</Text>
                  </Pressable>
                );
              }}
            />

            <SectionTitle
              title="Products"
              subtitle={`${filteredMedicines.length} item${filteredMedicines.length === 1 ? "" : "s"} available`}
            />
          </View>
        }
        ListEmptyComponent={
          <AppCard style={styles.emptyCard}>
            <Pill size={26} color={colors.primaryDark} />
            <Text style={styles.emptyTitle}>No medicines found</Text>
            <Text style={styles.emptyText}>Try a different category or search term.</Text>
          </AppCard>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <FallbackImage
              uri={item.image}
              style={styles.image}
              fallbackIcon={<Pill size={34} color={colors.primaryDark} />}
              accessibilityLabel={`${item.name} product picture`}
            />
            <View style={styles.productInfo}>
              <View style={styles.productTop}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              </View>
              <Text style={styles.meta}>{item.category}</Text>
              <Text style={styles.meta}>{item.packSize}</Text>
              <Text style={styles.dosage}>{item.dosage}</Text>
              <AppButton
                title="Add to Cart"
                size="sm"
                fullWidth={false}
                leftIcon={<PackagePlus size={16} color={colors.white} />}
                onPress={() => addToCart(item)}
              />
            </View>
          </AppCard>
        )}
      />

      <Pressable style={styles.cartFab} onPress={() => navigation.navigate("Cart")}>
        <ShoppingCart size={19} color={colors.white} />
        <Text style={styles.cartFabText}>Cart ({cartCount})</Text>
      </Pressable>
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
    paddingBottom: 104,
  },
  headerContent: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  cartMini: {
    minWidth: 58,
    minHeight: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xxs,
    ...shadows.soft,
  },
  cartMiniText: {
    ...typography.bodyBold,
    color: colors.primaryDark,
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
  categoryList: {
    gap: spacing.xs,
    paddingRight: spacing.lg,
  },
  categoryChip: {
    minHeight: 40,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: colors.white,
  },
  card: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  image: {
    width: 96,
    height: 104,
    borderRadius: radius.lg,
    backgroundColor: colors.border,
  },
  productInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  productTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  name: {
    ...typography.bodyBold,
    flex: 1,
  },
  meta: {
    ...typography.caption,
  },
  dosage: {
    ...typography.caption,
    color: colors.label,
    marginBottom: spacing.xs,
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
  cartFab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.card,
  },
  cartFabText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
