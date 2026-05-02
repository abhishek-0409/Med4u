import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SectionTitle({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  style,
}: SectionTitleProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable style={({ pressed }) => [styles.action, pressed && styles.pressed]} onPress={onActionPress}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...typography.title,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  action: {
    paddingVertical: spacing.xs,
    paddingLeft: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  actionText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
});
