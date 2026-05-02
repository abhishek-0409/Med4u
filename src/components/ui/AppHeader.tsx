import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface AppHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AppHeader({ eyebrow, title, subtitle, rightElement, style }: AppHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
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
  eyebrow: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  right: {
    alignItems: "flex-end",
  },
});
