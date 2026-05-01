import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface InputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "number-pad" | "phone-pad" | "email-address";
  secureTextEntry?: boolean;
  maxLength?: number;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  maxLength,
  rightElement,
  style,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          style={styles.input}
        />
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  inputWrap: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  inputWrapFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.text,
  },
});
