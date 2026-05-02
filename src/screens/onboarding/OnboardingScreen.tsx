import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { UserProfile } from "../../types/user";

const BACKGROUND = "#EEF4FF";
const TEAL = "#0F766E";
const TEAL_DARK = "#115E59";
const TEAL_LIGHT = "#E6FFFA";
const CARD = "#FFFFFF";
const TEXT = "#172554";
const MUTED = "#64748B";
const BORDER = "#D8E3F3";
const ERROR = "#DC2626";

const GENDERS = ["Male", "Female", "Other"] as const;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CONDITIONS = ["Diabetes", "Hypertension", "Asthma", "Heart Disease", "None"];

type Gender = (typeof GENDERS)[number] | "";

type OnboardingProfile = {
  fullName: string;
  age: string;
  gender: Gender;
  bloodGroup: string;
  conditions: string[];
  allergies: string;
  emergencyName: string;
  emergencyPhone: string;
};

type NavigationLike = {
  goBack?: () => void;
  navigate?: (screen: string, params?: unknown) => void;
  replace?: (screen: string, params?: unknown) => void;
};

type Props = {
  navigation?: NavigationLike;
  onComplete?: (profile: OnboardingProfile) => void;
};

const initialProfile: OnboardingProfile = {
  fullName: "",
  age: "",
  gender: "",
  bloodGroup: "",
  conditions: [],
  allergies: "",
  emergencyName: "",
  emergencyPhone: "",
};

export function OnboardingScreen({ navigation, onComplete }: Props) {
  const loginPhone = useAuthStore((state) => state.phone);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>(initialProfile);
  const [submitted, setSubmitted] = useState(false);
  const successScale = useRef(new Animated.Value(0.82)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const isFinalStep = step === 4;
  const progress = useMemo(() => ((step + 1) / 5) * 100, [step]);

  useEffect(() => {
    if (!isFinalStep) {
      successScale.setValue(0.82);
      successOpacity.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFinalStep, successOpacity, successScale]);

  const stepIsValid = useMemo(() => {
    if (step === 0 || step === 4) {
      return true;
    }

    if (step === 1) {
      const age = Number(profile.age);
      return (
        profile.fullName.trim().length >= 2 &&
        Number.isFinite(age) &&
        age > 0 &&
        age <= 120 &&
        Boolean(profile.gender) &&
        Boolean(profile.bloodGroup)
      );
    }

    if (step === 2) {
      return profile.conditions.length > 0;
    }

    const phone = profile.emergencyPhone.replace(/\D/g, "");
    return profile.emergencyName.trim().length >= 2 && phone.length >= 10;
  }, [profile, step]);

  const updateProfile = <Key extends keyof OnboardingProfile>(
    key: Key,
    value: OnboardingProfile[Key],
  ) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const toggleCondition = (condition: string) => {
    setProfile((current) => {
      if (condition === "None") {
        return { ...current, conditions: current.conditions.includes("None") ? [] : ["None"] };
      }

      const withoutNone = current.conditions.filter((item) => item !== "None");
      const exists = withoutNone.includes(condition);
      const conditions = exists
        ? withoutNone.filter((item) => item !== condition)
        : [...withoutNone, condition];

      return { ...current, conditions };
    });
  };

  const goBack = () => {
    if (step > 0) {
      setSubmitted(false);
      setStep((current) => current - 1);
      return;
    }

    navigation?.goBack?.();
  };

  const goNext = () => {
    setSubmitted(true);
    if (!stepIsValid) {
      return;
    }

    setSubmitted(false);
    setStep((current) => Math.min(current + 1, 4));
  };

  const finishOnboarding = () => {
    const formattedPhone = loginPhone ? `+91 ${loginPhone}` : undefined;

    onComplete?.(profile);
    completeOnboarding({
      name: profile.fullName.trim(),
      age: Number(profile.age),
      gender: (profile.gender || "Other") as UserProfile["gender"],
      bloodGroup: profile.bloodGroup,
      existingConditions: profile.conditions,
      allergies: profile.allergies.trim(),
      emergencyContactName: profile.emergencyName.trim(),
      emergencyContactPhone: profile.emergencyPhone.trim(),
      ...(formattedPhone ? { phone: formattedPhone } : {}),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={goBack}
            style={[styles.navIcon, step === 0 && styles.navIconMuted]}
          >
            <Ionicons name="chevron-back" size={22} color={step === 0 ? MUTED : TEXT} />
          </TouchableOpacity>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.dotsRow}>
              {[0, 1, 2, 3, 4].map((item) => (
                <View key={item} style={[styles.dot, item <= step && styles.dotActive]} />
              ))}
            </View>
          </View>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{step + 1}/5</Text>
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {step === 0 ? <WelcomeStep /> : null}
          {step === 1 ? (
            <PersonalInfoStep
              profile={profile}
              submitted={submitted}
              updateProfile={updateProfile}
            />
          ) : null}
          {step === 2 ? (
            <HealthInfoStep
              profile={profile}
              submitted={submitted}
              toggleCondition={toggleCondition}
              updateProfile={updateProfile}
            />
          ) : null}
          {step === 3 ? (
            <EmergencyContactStep
              profile={profile}
              submitted={submitted}
              updateProfile={updateProfile}
            />
          ) : null}
          {step === 4 ? (
            <AllSetStep scale={successScale} opacity={successOpacity} />
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && step < 4 ? (
            <TouchableOpacity activeOpacity={0.76} style={styles.secondaryButton} onPress={goBack}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.84}
            style={[styles.primaryButton, step > 0 && step < 4 && styles.primaryButtonSplit]}
            onPress={isFinalStep ? finishOnboarding : goNext}
          >
            <Text style={styles.primaryButtonText}>
              {step === 0 ? "Get Started" : isFinalStep ? "Go to Home" : "Continue"}
            </Text>
            <Ionicons
              name={isFinalStep ? "home" : "arrow-forward"}
              size={18}
              color={CARD}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function WelcomeStep() {
  return (
    <View style={styles.centeredPage}>
      <View style={styles.heroIllustration}>
        <View style={styles.heroPulseOuter} />
        <View style={styles.heroCircle}>
          <Ionicons name="medical" size={62} color={TEAL} />
        </View>
        <View style={[styles.floatIcon, styles.floatIconTop]}>
          <Ionicons name="heart" size={20} color={TEAL} />
        </View>
        <View style={[styles.floatIcon, styles.floatIconBottom]}>
          <Ionicons name="shield-checkmark" size={20} color={TEAL} />
        </View>
      </View>

      <Text style={styles.welcomeTitle}>Welcome to Med4U</Text>
      <Text style={styles.welcomeSubtitle}>Your health, simplified</Text>
      <Text style={styles.welcomeCopy}>
        Set up your basic health profile so doctors, medicines and tests feel more personal from day one.
      </Text>
    </View>
  );
}

function PersonalInfoStep({
  profile,
  submitted,
  updateProfile,
}: {
  profile: OnboardingProfile;
  submitted: boolean;
  updateProfile: <Key extends keyof OnboardingProfile>(
    key: Key,
    value: OnboardingProfile[Key],
  ) => void;
}) {
  return (
    <StepCard
      icon="person"
      title="Personal Info"
      subtitle="Tell us the basics for your health profile."
    >
      <InputField
        label="Full Name"
        icon="person-outline"
        value={profile.fullName}
        placeholder="Enter your full name"
        onChangeText={(value) => updateProfile("fullName", value)}
        error={submitted && profile.fullName.trim().length < 2 ? "Please enter your name." : undefined}
      />

      <InputField
        label="Age"
        icon="calendar-outline"
        value={profile.age}
        placeholder="Enter your age"
        keyboardType="number-pad"
        onChangeText={(value) => updateProfile("age", value.replace(/\D/g, "").slice(0, 3))}
        error={submitted && !isValidAge(profile.age) ? "Please enter a valid age." : undefined}
      />

      <ChipGroup label="Gender">
        {GENDERS.map((gender) => (
          <SelectorChip
            key={gender}
            label={gender}
            selected={profile.gender === gender}
            onPress={() => updateProfile("gender", gender)}
          />
        ))}
      </ChipGroup>
      {submitted && !profile.gender ? <Text style={styles.errorText}>Please select gender.</Text> : null}

      <ChipGroup label="Blood Group">
        {BLOOD_GROUPS.map((group) => (
          <SelectorChip
            key={group}
            label={group}
            selected={profile.bloodGroup === group}
            onPress={() => updateProfile("bloodGroup", group)}
          />
        ))}
      </ChipGroup>
      {submitted && !profile.bloodGroup ? <Text style={styles.errorText}>Please select blood group.</Text> : null}
    </StepCard>
  );
}

function HealthInfoStep({
  profile,
  submitted,
  toggleCondition,
  updateProfile,
}: {
  profile: OnboardingProfile;
  submitted: boolean;
  toggleCondition: (condition: string) => void;
  updateProfile: <Key extends keyof OnboardingProfile>(
    key: Key,
    value: OnboardingProfile[Key],
  ) => void;
}) {
  return (
    <StepCard
      icon="fitness"
      title="Health Info"
      subtitle="Select any existing conditions. You can update these later."
    >
      <ChipGroup label="Existing Conditions">
        {CONDITIONS.map((condition) => (
          <SelectorChip
            key={condition}
            label={condition}
            selected={profile.conditions.includes(condition)}
            onPress={() => toggleCondition(condition)}
          />
        ))}
      </ChipGroup>
      {submitted && profile.conditions.length === 0 ? (
        <Text style={styles.errorText}>Please select at least one option.</Text>
      ) : null}

      <InputField
        label="Allergies"
        icon="alert-circle-outline"
        value={profile.allergies}
        placeholder="Optional, e.g. penicillin, dust"
        onChangeText={(value) => updateProfile("allergies", value)}
        multiline
      />
    </StepCard>
  );
}

function EmergencyContactStep({
  profile,
  submitted,
  updateProfile,
}: {
  profile: OnboardingProfile;
  submitted: boolean;
  updateProfile: <Key extends keyof OnboardingProfile>(
    key: Key,
    value: OnboardingProfile[Key],
  ) => void;
}) {
  const phone = profile.emergencyPhone.replace(/\D/g, "");

  return (
    <StepCard
      icon="call"
      title="Emergency Contact"
      subtitle="Add someone we can surface quickly in urgent situations."
    >
      <InputField
        label="Contact Name"
        icon="person-add-outline"
        value={profile.emergencyName}
        placeholder="Enter contact name"
        onChangeText={(value) => updateProfile("emergencyName", value)}
        error={
          submitted && profile.emergencyName.trim().length < 2
            ? "Please enter contact name."
            : undefined
        }
      />

      <InputField
        label="Phone Number"
        icon="call-outline"
        value={profile.emergencyPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        onChangeText={(value) => updateProfile("emergencyPhone", value.replace(/[^\d+\s-]/g, "").slice(0, 16))}
        error={submitted && phone.length < 10 ? "Please enter a valid phone number." : undefined}
      />
    </StepCard>
  );
}

function AllSetStep({
  scale,
  opacity,
}: {
  scale: Animated.Value;
  opacity: Animated.Value;
}) {
  return (
    <View style={styles.centeredPage}>
      <Animated.View style={[styles.successIllustration, { opacity, transform: [{ scale }] }]}>
        <View style={styles.successRing}>
          <Ionicons name="checkmark-circle" size={92} color={TEAL} />
        </View>
      </Animated.View>

      <Text style={styles.welcomeTitle}>Your profile is ready!</Text>
      <Text style={styles.welcomeCopy}>
        Med4U is now set up with your basic health details for faster care.
      </Text>
    </View>
  );
}

function StepCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Ionicons name={icon} size={24} color={TEAL} />
        </View>
        <View style={styles.cardHeaderCopy}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.formStack}>{children}</View>
    </View>
  );
}

function InputField({
  label,
  icon,
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  error,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad" | "phone-pad";
  multiline?: boolean;
  error?: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.inputWrapMultiline, error && styles.inputWrapError]}>
        <Ionicons name={icon} size={19} color={error ? ERROR : MUTED} />
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          style={[styles.input, multiline && styles.inputMultiline]}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipWrap}>{children}</View>
    </View>
  );
}

function SelectorChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
      {selected ? <Ionicons name="checkmark" size={15} color={CARD} /> : null}
    </TouchableOpacity>
  );
}

function isValidAge(ageValue: string) {
  const age = Number(ageValue);
  return Number.isFinite(age) && age > 0 && age <= 120;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  keyboardView: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  navIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  navIconMuted: {
    opacity: 0.55,
  },
  progressWrap: {
    flex: 1,
    gap: 8,
  },
  progressTrack: {
    height: 7,
    borderRadius: 7,
    backgroundColor: "#DDE8F8",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 7,
    backgroundColor: TEAL,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  dotActive: {
    width: 18,
    backgroundColor: TEAL,
  },
  stepBadge: {
    minWidth: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFEFE8",
  },
  stepBadgeText: {
    color: TEAL_DARK,
    fontSize: 12,
    fontWeight: "800",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 130,
  },
  centeredPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 540,
  },
  heroIllustration: {
    width: 218,
    height: 218,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  heroPulseOuter: {
    position: "absolute",
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: "#DDF7F3",
  },
  heroCircle: {
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C4EFE9",
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  floatIcon: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  floatIconTop: {
    top: 26,
    right: 22,
  },
  floatIconBottom: {
    bottom: 24,
    left: 20,
  },
  welcomeTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    color: TEXT,
    textAlign: "center",
  },
  welcomeSubtitle: {
    marginTop: 8,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "700",
    color: TEAL,
    textAlign: "center",
  },
  welcomeCopy: {
    marginTop: 12,
    maxWidth: 310,
    fontSize: 15,
    lineHeight: 23,
    color: MUTED,
    textAlign: "center",
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 22,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "900",
    color: TEXT,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
  },
  formStack: {
    gap: 18,
  },
  fieldBlock: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT,
  },
  inputWrap: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: BORDER,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputWrapMultiline: {
    minHeight: 104,
    alignItems: "flex-start",
    paddingTop: 15,
  },
  inputWrapError: {
    borderColor: ERROR,
    backgroundColor: "#FFF7F7",
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 74,
    lineHeight: 21,
    paddingTop: 0,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    minHeight: 42,
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: BORDER,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  chipSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT,
  },
  chipTextSelected: {
    color: CARD,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 17,
    color: ERROR,
    fontWeight: "600",
  },
  successIllustration: {
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: "#DDF7F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  successRing: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C4EFE9",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
    backgroundColor: "rgba(238, 244, 255, 0.96)",
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 22,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.26,
    shadowRadius: 18,
    elevation: 6,
  },
  primaryButtonSplit: {
    flex: 1.35,
  },
  primaryButtonText: {
    color: CARD,
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 22,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  secondaryButtonText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
  },
});

export default OnboardingScreen;
