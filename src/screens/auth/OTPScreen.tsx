import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { AuthStackParamList } from "../../types/navigation";
import { maskPhone } from "../../utils/helpers";

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

export function OTPScreen({ route }: Props) {
  const { phone } = route.params;
  const [otp, setOtp] = useState("");
  const { verifyOtp, isLoading, error } = useAuth();

  const onVerify = async () => {
    try {
      await verifyOtp(otp);
    } catch {
      Alert.alert("Verification failed", "Please check OTP and try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>We sent a 4-digit code to {maskPhone(phone)}</Text>
        <Input
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          placeholder="0000"
          keyboardType="number-pad"
          maxLength={4}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Verify & Continue" onPress={onVerify} loading={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.body,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
