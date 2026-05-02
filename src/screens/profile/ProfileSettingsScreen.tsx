import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Droplets, Mail, Phone, UserRound } from "lucide-react-native";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, shadows, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { MainStackParamList } from "../../types/navigation";
import { UserProfile } from "../../types/user";

type Props = NativeStackScreenProps<MainStackParamList, "ProfileSettings">;

const genders: UserProfile["gender"][] = ["Male", "Female", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function ProfileSettingsScreen({ navigation }: Props) {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    age: String(profile.age),
    gender: profile.gender,
    bloodGroup: profile.bloodGroup,
  });

  const updateForm = <Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSave = () => {
    const age = Number(form.age);

    if (form.name.trim().length < 2) {
      Alert.alert("Name required", "Please enter your full name.");
      return;
    }

    if (!Number.isFinite(age) || age <= 0 || age > 120) {
      Alert.alert("Invalid age", "Please enter a valid age.");
      return;
    }

    setProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      age,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
    });
    Alert.alert("Saved", "Your profile details have been updated.");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AppHeader
        eyebrow="Profile"
        title="Profile Settings"
        subtitle="Keep your personal and medical details up to date."
      />

      <AppCard style={styles.card}>
        <SettingsInput
          label="Full Name"
          value={form.name}
          placeholder="Enter full name"
          icon={<UserRound size={18} color={colors.primaryDark} />}
          onChangeText={(value) => updateForm("name", value)}
        />
        <SettingsInput
          label="Phone Number"
          value={form.phone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          icon={<Phone size={18} color={colors.primaryDark} />}
          onChangeText={(value) => updateForm("phone", value)}
        />
        <SettingsInput
          label="Email"
          value={form.email}
          placeholder="Enter email"
          keyboardType="email-address"
          icon={<Mail size={18} color={colors.primaryDark} />}
          onChangeText={(value) => updateForm("email", value)}
        />
        <SettingsInput
          label="Age"
          value={form.age}
          placeholder="Enter age"
          keyboardType="number-pad"
          icon={<UserRound size={18} color={colors.primaryDark} />}
          onChangeText={(value) => updateForm("age", value.replace(/\D/g, "").slice(0, 3))}
        />
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.groupTitle}>Gender</Text>
        <View style={styles.chipWrap}>
          {genders.map((gender) => (
            <Chip
              key={gender}
              label={gender}
              selected={form.gender === gender}
              onPress={() => updateForm("gender", gender)}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.groupHeader}>
          <Droplets size={18} color={colors.primaryDark} />
          <Text style={styles.groupTitle}>Blood Group</Text>
        </View>
        <View style={styles.chipWrap}>
          {bloodGroups.map((group) => (
            <Chip
              key={group}
              label={group}
              selected={form.bloodGroup === group}
              onPress={() => updateForm("bloodGroup", group)}
            />
          ))}
        </View>
      </AppCard>

      <AppButton title="Save Changes" onPress={onSave} />
    </ScrollView>
  );
}

function SettingsInput({
  label,
  value,
  placeholder,
  keyboardType = "default",
  icon,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "phone-pad" | "email-address" | "number-pad";
  icon: React.ReactNode;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    gap: spacing.md,
  },
  inputBlock: {
    gap: spacing.xs,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.label,
    fontWeight: "700",
  },
  inputWrap: {
    minHeight: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.text,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  groupTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    minHeight: 40,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "700",
  },
  chipTextSelected: {
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
