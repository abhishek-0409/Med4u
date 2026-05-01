import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../../hooks/useAuth";
import { AuthStackParamList } from "../../types/navigation";
import { maskPhone } from "../../utils/helpers";
import Svg, { Rect, Circle, Path, Ellipse } from "react-native-svg";

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

const OTP_LENGTH = 6;
const TEAL       = "#4CAF93";
const TEAL_DARK  = "#3a9678";
const TEAL_LIGHT = "#e8f7f3";
const ERROR_RED  = "#E53935";

// ─── Mailbox Illustration ────────────────────────────────────────────────────
function MailboxIllustration() {
  return (
    <View style={styles.illustrationWrapper}>
      <View style={styles.illustrationCircle} />
      <Svg width={170} height={150} viewBox="0 0 170 150">
        {/* Post */}
        <Rect x="80" y="94" width="11" height="44" rx="3" fill="#B0BEC5" />
        {/* Mailbox body */}
        <Rect x="36" y="54" width="90" height="52" rx="12" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="1.5" />
        {/* Rounded top cap */}
        <Ellipse cx="81" cy="54" rx="45" ry="13" fill="#CFD8DC" />
        {/* Mail slot */}
        <Rect x="52" y="72" width="54" height="5" rx="2.5" fill="#90A4AE" />
        {/* Flag pole */}
        <Rect x="121" y="60" width="3.5" height="24" rx="1.5" fill="#EF5350" />
        {/* Flag */}
        <Rect x="121" y="58" width="14" height="10" rx="2.5" fill="#EF5350" />
        {/* Envelope */}
        <Rect x="62" y="40" width="38" height="28" rx="4" fill="#ffffff" stroke="#CFD8DC" strokeWidth="1.2" />
        <Path d="M62 44 L81 57 L100 44" stroke="#CFD8DC" strokeWidth="1.2" fill="none" />
        {/* Decorative dots */}
        <Circle cx="26"  cy="44"  r="6"   fill={TEAL}    opacity="0.65" />
        <Circle cx="148" cy="34"  r="5"   fill="#FF8A65" opacity="0.75" />
        <Circle cx="154" cy="76"  r="4"   fill="#FFD54F" opacity="0.85" />
        <Circle cx="20"  cy="82"  r="4"   fill="#CE93D8" opacity="0.70" />
        <Circle cx="38"  cy="26"  r="3.5" fill="#EF9A9A" opacity="0.70" />
        <Circle cx="132" cy="104" r="3.5" fill={TEAL}    opacity="0.55" />
      </Svg>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export function OTPScreen({ route, navigation }: Props) {
  const { phone } = route.params;

  const [otp, setOtp]              = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocused] = useState<number>(0);
  const [resendTimer, setTimer]    = useState(30);
  const [canResend, setCanResend]  = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  const { verifyOtp, isLoading, error } = useAuth();

  // ── Countdown timer ──
  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ── Shake boxes ──
  const shake = () =>
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  9, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  7, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  0, duration: 55, useNativeDriver: true }),
    ]).start();

  // ── Button bounce ──
  const bounceBtn = (cb: () => void) =>
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 70, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1.00, duration: 70, useNativeDriver: true }),
    ]).start(cb);

  // ── Handle digit input ──
  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    // Paste support: distribute digits
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
      digits.split("").forEach((d, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const next = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[next]?.focus();
      return;
    }

    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  // ── Backspace: go to previous box ──
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── Verify ──
  const onVerify = () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { shake(); return; }
    bounceBtn(async () => {
      try {
        await verifyOtp(code);
      } catch {
        shake();
        Alert.alert("Verification Failed", "The OTP you entered is incorrect. Please try again.");
      }
    });
  };

  // ── Resend ──
  const onResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(30);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    // TODO: trigger your resend API call here
  };

  const allFilled = otp.every((d) => d !== "");

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Back Button ── */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path
            d="M15 18l-6-6 6-6"
            stroke="#333333"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </TouchableOpacity>

      {/* ── Illustration ── */}
      <MailboxIllustration />

      {/* ── Heading ── */}
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter OTP sent to{" "}
        <Text style={styles.phoneText}>{maskPhone(phone)}</Text>
      </Text>

      {/* ── OTP Input Boxes ── */}
      <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => (inputRefs.current[i] = r)}
            style={[
              styles.otpBox,
              focusedIndex === i && styles.otpBoxFocused,
              digit !== ""       && styles.otpBoxFilled,
              !!error            && styles.otpBoxError,
            ]}
            value={digit}
            onChangeText={(v) => handleChange(v, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(-1)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoFocus={i === 0}
            caretHidden={false}
            // Android vertical centering
            paddingVertical={0}
            includeFontPadding={false}
          />
        ))}
      </Animated.View>

      {/* ── Error message ── */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.errorSpacer} />
      )}

      {/* ── Resend row ── */}
      <View style={styles.resendRow}>
        <Text style={styles.resendLabel}>Don't receive the OTP? </Text>
        <TouchableOpacity onPress={onResend} disabled={!canResend} activeOpacity={0.7}>
          <Text style={[styles.resendAction, !canResend && styles.resendWaiting]}>
            RESEND OTP{!canResend ? ` (${resendTimer}s)` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Verify Button ── */}
      <Animated.View style={[styles.verifyWrapper, { transform: [{ scale: btnScale }] }]}>
        <Pressable
          style={({ pressed }) => [
            styles.verifyBtn,
            pressed    && styles.verifyBtnPressed,
            !allFilled && styles.verifyBtnDisabled,
          ]}
          onPress={onVerify}
          disabled={isLoading}
          android_ripple={{ color: "rgba(255,255,255,0.25)", borderless: false }}
        >
          {isLoading
            ? <ActivityIndicator color="#ffffff" size="small" />
            : <Text style={styles.verifyText}>VERIFY</Text>
          }
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 24,
    paddingBottom: 40,
    alignItems: "center",
  },

  // Back
  backBtn: {
    alignSelf: "flex-start",
    padding: 6,
    marginBottom: 16,
  },

  // Illustration
  illustrationWrapper: {
    width: 190,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  illustrationCircle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e6f7f3",
  },

  // Heading
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14.5,
    color: "#9e9e9e",
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
  },
  phoneText: {
    color: "#1a1a2e",
    fontWeight: "700",
  },

  // OTP Boxes
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.8,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a2e",
    textAlign: "center",
  },
  otpBoxFocused: {
    borderColor: TEAL,
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
    }),
  },
  otpBoxFilled: {
    borderColor: TEAL,
    backgroundColor: TEAL_LIGHT,
  },
  otpBoxError: {
    borderColor: ERROR_RED,
    backgroundColor: "#fff5f5",
  },

  // Error / spacer
  errorText: {
    fontSize: 13,
    color: ERROR_RED,
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 18,
  },
  errorSpacer: {
    height: 24,
  },

  // Resend
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 48,
  },
  resendLabel: {
    fontSize: 13.5,
    color: "#9e9e9e",
  },
  resendAction: {
    fontSize: 13.5,
    fontWeight: "700",
    color: TEAL,
    letterSpacing: 0.4,
  },
  resendWaiting: {
    color: "#b0bec5",
  },

  // Verify button
  verifyWrapper: {
    width: "100%",
  },
  verifyBtn: {
    backgroundColor: TEAL,
    borderRadius: 16,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  verifyBtnPressed: {
    backgroundColor: TEAL_DARK,
  },
  verifyBtnDisabled: {
    backgroundColor: "#a8d5c5",
    ...Platform.select({
      ios:     { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },
  verifyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
});
