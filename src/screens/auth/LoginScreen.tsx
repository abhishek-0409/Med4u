import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, ChevronRight, Clock3, ShieldCheck, Stethoscope } from "lucide-react-native";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { AuthStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const { requestOtp, isLoading, error } = useAuth();

  const sanitizedPhone = useMemo(() => phone.replace(/\D/g, "").slice(0, 10), [phone]);
  const isValidPhone = sanitizedPhone.length === 10;

  const onContinue = async () => {
    if (!isValidPhone) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await requestOtp(sanitizedPhone);
      navigation.navigate("OTP", { phone: sanitizedPhone });
    } catch {
      Alert.alert("Failed", "Unable to send OTP right now. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#E4F2F1", "#E9F1F8", "#F7FBFD"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.keyboardView, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <View style={styles.iconWrap}>
              <Stethoscope color={colors.primaryDark} size={22} />
            </View>
            <Text style={styles.brandText}>Med4U</Text>
          </View>

          <Text style={styles.title}>Healthcare, reimagined.</Text>
          <Text style={styles.subtitle}>
            Login with your phone number to access doctors, lab tests, medicines and digital prescriptions.
          </Text>

          <View style={styles.badgeRow}>
            <InfoBadge icon={<ShieldCheck size={13} color={colors.primaryDark} />} text="Safe Login" />
            <InfoBadge icon={<Clock3 size={13} color={colors.primaryDark} />} text="30 sec OTP" />
            <InfoBadge icon={<CheckCircle2 size={13} color={colors.primaryDark} />} text="Trusted Care" />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Continue With Phone</Text>
          <Text style={styles.formSub}>We will send a one-time password to verify your account.</Text>

          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <Input
              label="Mobile Number"
              value={sanitizedPhone}
              onChangeText={setPhone}
              placeholder="Enter 10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.inputWrap}
              rightElement={
                isValidPhone ? <CheckCircle2 size={18} color={colors.success} /> : undefined
              }
            />
          </View>

          <View style={styles.helperRow}>
            <Text style={styles.helperText}>
              OTP will be sent to +91 {sanitizedPhone || "XXXXXXXXXX"}
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Send OTP"
            loading={isLoading}
            disabled={!isValidPhone}
            leftIcon={<ChevronRight size={18} color={colors.white} />}
            onPress={onContinue}
          />

          <Pressable style={({ pressed }) => [styles.helpButton, pressed && { opacity: 0.75 }]}>
            <Text style={styles.helpText}>Need help with login?</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function InfoBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.badge}>
      {icon}
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandText: {
    ...typography.title,
    color: colors.primaryDark,
  },
  title: {
    ...typography.h2,
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    ...typography.body,
    maxWidth: "92%",
    color: colors.text,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    ...typography.h3,
    fontSize: 22,
  },
  formSub: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: -4,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  countryCode: {
    minHeight: 56,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    marginBottom: 1,
  },
  countryCodeText: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  inputWrap: {
    flex: 1,
  },
  helperRow: {
    marginTop: -8,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
  helpButton: {
    alignSelf: "center",
    paddingVertical: 4,
  },
  helpText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "600",
  },
});
