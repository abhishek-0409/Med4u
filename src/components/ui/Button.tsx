import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "md" | "sm";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  leftIcon,
  fullWidth = true,
  size = "md",
  style,
  disabled,
  ...props
}: ButtonProps) {
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === "sm" ? styles.baseSm : styles.baseMd,
        isOutline ? styles.outline : styles.primary,
        !fullWidth && styles.inline,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text style={[styles.label, isOutline && styles.labelOutline]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  baseMd: {
    minHeight: 52,
  },
  baseSm: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  primary: {
    backgroundColor: colors.primaryDark,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.primaryDark,
  },
  inline: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  label: {
    ...typography.button,
    color: colors.white,
  },
  labelOutline: {
    color: colors.primaryDark,
  },
});
