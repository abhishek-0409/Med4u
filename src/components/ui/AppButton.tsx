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
import { radius, shadows, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type AppButtonVariant = "primary" | "outline" | "ghost" | "danger";
type AppButtonSize = "md" | "sm";

export interface AppButtonProps extends Omit<PressableProps, "style"> {
  title?: string;
  variant?: AppButtonVariant;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: AppButtonSize;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  title,
  variant = "primary",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  size = "md",
  style,
  disabled,
  ...props
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === "sm" ? styles.sm : styles.md,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        !fullWidth && styles.inline,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? colors.primaryDark : colors.white} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          {title ? (
            <Text
              style={[
                styles.label,
                (isOutline || isGhost) && styles.labelOutline,
                isDanger && styles.labelDanger,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : null}
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  md: {
    minHeight: 52,
  },
  sm: {
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.soft,
  },
  outline: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  inline: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
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
  labelDanger: {
    color: colors.white,
  },
});
