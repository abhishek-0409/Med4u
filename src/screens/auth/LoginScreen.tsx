import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stethoscope, ChevronRight } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import { AuthStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const TEAL = "#4A9E96";
const TEAL_DARK = "#3A8880";
const TEAL_LIGHT = "#EAF4F3";
const BG = "#DFF0EE";

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const { requestOtp, isLoading, error } = useAuth();

  const sanitizedPhone = useMemo(
    () => phone.replace(/\D/g, "").slice(0, 10),
    [phone]
  );
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
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand ── */}
          <View style={styles.brandSection}>
            <View style={styles.logoCircle}>
              <Stethoscope color={TEAL} size={28} strokeWidth={1.8} />
            </View>
            <Text style={styles.brandName}>Med4U</Text>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login With Phone</Text>
            <Text style={styles.cardSub}>
              We will send a one-time password to verify your account.
            </Text>

            {/* Label */}
            <Text style={styles.label}>Mobile Number</Text>

            {/* Phone Input Row */}
            <View style={styles.phoneRow}>
              <View style={styles.countryBox}>
                <Text style={styles.countryText}>+91</Text>
              </View>
              <TextInput
                style={[
                  styles.phoneInput,
                  isValidPhone && styles.phoneInputValid,
                ]}
                value={sanitizedPhone}
                onChangeText={setPhone}
                placeholder="Enter 10-digit"
                placeholderTextColor="#B0BEC5"
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={onContinue}
              />
            </View>

            {/* Helper */}
            <Text style={styles.helperText}>
              OTP will be sent to +91 {sanitizedPhone || "XXXXXXXXXX"}
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[
                styles.otpButton,
                (!isValidPhone || isLoading) && styles.otpButtonDisabled,
              ]}
              onPress={onContinue}
              disabled={!isValidPhone || isLoading}
              activeOpacity={0.85}
            >
              <ChevronRight size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.otpButtonText}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Text>
            </TouchableOpacity>

            {/* Help */}
            <Pressable
              style={({ pressed }) => [styles.helpBtn, pressed && { opacity: 0.6 }]}
              onPress={() =>
                Alert.alert(
                  "Need Help?",
                  "Please contact support@med4u.in for login assistance."
                )
              }
            >
              <Text style={styles.helpText}>Need help with login?</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  kav: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 36,
  },

  // ── Brand ──
  brandSection: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  brandName: {
    fontSize: 30,
    fontWeight: "700",
    color: TEAL,
    letterSpacing: -0.5,
  },

  // ── Card ──
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 7,
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#1C2B2A",
    textAlign: "center",
  },

  cardSub: {
    fontSize: 13.5,
    color: "#78909C",
    textAlign: "center",
    lineHeight: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#546E7A",
    textAlign: "center",
  },

  // ── Phone ──
  phoneRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  countryBox: {
    height: 56,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#F0F7F6",
    borderWidth: 1.5,
    borderColor: "#C8DFDD",
    alignItems: "center",
    justifyContent: "center",
  },

  countryText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEAL_DARK,
  },

  phoneInput: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F0F7F6",
    borderWidth: 1.5,
    borderColor: "#C8DFDD",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1C2B2A",
  },

  phoneInputValid: {
    borderColor: TEAL,
    backgroundColor: TEAL_LIGHT,
  },

  helperText: {
    fontSize: 12,
    color: "#90A4AE",
    marginTop: -4,
  },

  errorText: {
    fontSize: 12,
    color: "#E53935",
  },

  // ── Button ──
  otpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
    backgroundColor: TEAL,
    marginTop: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  otpButtonDisabled: {
    backgroundColor: "#A8CCC9",
    shadowOpacity: 0,
    elevation: 0,
  },

  otpButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // ── Help ──
  helpBtn: {
    alignSelf: "center",
    paddingVertical: 4,
  },

  helpText: {
    fontSize: 13,
    fontWeight: "700",
    color: TEAL,
  },
});
