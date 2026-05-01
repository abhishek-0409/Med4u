import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Minus, Plus } from "lucide-react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
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
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add medicines to continue with checkout.</Text>
          <Button
            title="Browse Medicines"
            onPress={() => navigation.navigate("OrderMedicine")}
            fullWidth={false}
          />
        </Card>
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
          <Card style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.medicine.name}</Text>
              <Text style={styles.meta}>{item.medicine.packSize}</Text>
              <Text style={styles.price}>{formatCurrency(item.medicine.price)}</Text>
            </View>
            <View style={styles.counter}>
              <Button
                title=""
                fullWidth={false}
                variant="outline"
                style={styles.counterButton}
                leftIcon={<Minus size={16} color={colors.primaryDark} />}
                onPress={() => decrement(item.id)}
              />
              <Text style={styles.qty}>{item.quantity}</Text>
              <Button
                title=""
                fullWidth={false}
                variant="outline"
                style={styles.counterButton}
                leftIcon={<Plus size={16} color={colors.primaryDark} />}
                onPress={() => increment(item.id)}
              />
            </View>
          </Card>
        )}
      />

      <Card style={styles.checkoutCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </View>
        <Button
          title="Place Order"
          onPress={() => {
            clearCart();
            navigation.navigate("Home");
          }}
        />
      </Card>
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
    borderRadius: radius.pill,
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
