import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Minus, Plus } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { MainStackParamList } from "../../types/navigation";
import { formatCurrency } from "../../utils/helpers";

type Props = NativeStackScreenProps<MainStackParamList, "Cart">;

export function CartScreen({ navigation }: Props) {
  const cart = useUserStore((state) => state.cart);
  const increment = useUserStore((state) => state.incrementCartItem);
  const decrement = useUserStore((state) => state.decrementCartItem);
  const clearCart = useUserStore((state) => state.clearCart);

  const total = cart.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <AppCard style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add medicines to continue with checkout.</Text>
          <AppButton
            title="Browse Medicines"
            onPress={() => navigation.navigate("OrderMedicine")}
            fullWidth={false}
          />
        </AppCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AppCard style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.name}>{item.medicine.name}</Text>
              <Text style={styles.meta}>{item.medicine.packSize}</Text>
              <Text style={styles.price}>{formatCurrency(item.medicine.price)}</Text>
            </View>
            <View style={styles.counter}>
              <AppButton
                title=""
                fullWidth={false}
                variant="outline"
                style={styles.counterButton}
                leftIcon={<Minus size={16} color={colors.primaryDark} />}
                onPress={() => decrement(item.id)}
              />
              <Text style={styles.qty}>{item.quantity}</Text>
              <AppButton
                title=""
                fullWidth={false}
                variant="outline"
                style={styles.counterButton}
                leftIcon={<Plus size={16} color={colors.primaryDark} />}
                onPress={() => increment(item.id)}
              />
            </View>
          </AppCard>
        )}
      />

      <AppCard style={styles.checkoutCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </View>
        <AppButton
          title="Place Order"
          onPress={() => {
            clearCart();
            navigation.navigate("Home");
          }}
        />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyWrap: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.lg,
  },
  emptyCard: {
    gap: spacing.md,
    alignItems: "flex-start",
  },
  emptyTitle: {
    ...typography.h3,
  },
  emptyText: {
    ...typography.body,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
  },
  meta: {
    ...typography.caption,
  },
  price: {
    ...typography.bodyBold,
    color: colors.primaryDark,
    marginTop: 2,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  counterButton: {
    minHeight: 38,
    width: 38,
    paddingHorizontal: 0,
    borderRadius: radius.lg,
  },
  qty: {
    ...typography.bodyBold,
    width: 24,
    textAlign: "center",
  },
  checkoutCard: {
    gap: spacing.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    ...typography.bodyBold,
  },
  totalAmount: {
    ...typography.h3,
    color: colors.primaryDark,
  },
});
