import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ShoppingCart } from "lucide-react-native";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
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
  const addToCart = useUserStore((state) => state.addToCart);
  const cartCount = useUserStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0));

  useEffect(() => {
    (async () => {
      const data = await medicineService.getMedicines();
      setMedicines(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category}</Text>
              <Text style={styles.meta}>{item.packSize}</Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <Button title="Add to Cart" fullWidth={false} onPress={() => addToCart(item)} />
            </View>
          </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  list: {
    gap: spacing.md,
    paddingBottom: 96,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    ...shadows.soft,
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: radius.md,
  },
  name: {
    ...typography.bodyBold,
  },
  meta: {
    ...typography.caption,
  },
  price: {
    ...typography.title,
    marginVertical: spacing.xs,
    color: colors.primaryDark,
  },
  cartFab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cartFabText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
