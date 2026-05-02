import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Bell, Fingerprint, FlaskConical, HeartPulse, Pill, ShieldCheck } from "lucide-react-native";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { MainStackParamList } from "../../types/navigation";
import { AppSettings } from "../../types/user";

type Props = NativeStackScreenProps<MainStackParamList, "AppSettings">;

export function AppSettingsScreen(_props: Props) {
  const appSettings = useUserStore((state) => state.appSettings);
  const setAppSettings = useUserStore((state) => state.setAppSettings);

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    setAppSettings({ [key]: value });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AppHeader
        eyebrow="Preferences"
        title="App Settings"
        subtitle="Control reminders, alerts and privacy preferences."
      />

      <View style={styles.sectionBlock}>
        <SectionTitle title="Notifications" subtitle="Choose what Med4U can remind you about" />
        <AppCard style={styles.settingsCard}>
          <SettingRow
            title="Push Notifications"
            subtitle="Receive important app alerts"
            icon={<Bell size={18} color={colors.primaryDark} />}
            value={appSettings.pushNotifications}
            onValueChange={(value) => updateSetting("pushNotifications", value)}
          />
          <SettingRow
            title="Appointment Reminders"
            subtitle="Get notified before doctor consultations"
            icon={<HeartPulse size={18} color={colors.primaryDark} />}
            value={appSettings.appointmentReminders}
            onValueChange={(value) => updateSetting("appointmentReminders", value)}
          />
          <SettingRow
            title="Medicine Reminders"
            subtitle="Helpful nudges for medicine orders"
            icon={<Pill size={18} color={colors.primaryDark} />}
            value={appSettings.medicineReminders}
            onValueChange={(value) => updateSetting("medicineReminders", value)}
          />
          <SettingRow
            title="Lab Report Alerts"
            subtitle="Know when reports are ready"
            icon={<FlaskConical size={18} color={colors.primaryDark} />}
            value={appSettings.labReportAlerts}
            onValueChange={(value) => updateSetting("labReportAlerts", value)}
            last
          />
        </AppCard>
      </View>

      <View style={styles.sectionBlock}>
        <SectionTitle title="Privacy" subtitle="Keep your health information protected" />
        <AppCard style={styles.settingsCard}>
          <SettingRow
            title="Health Tips"
            subtitle="Show personalized wellness suggestions"
            icon={<ShieldCheck size={18} color={colors.primaryDark} />}
            value={appSettings.healthTips}
            onValueChange={(value) => updateSetting("healthTips", value)}
          />
          <SettingRow
            title="Biometric Lock"
            subtitle="Require device security to open Med4U"
            icon={<Fingerprint size={18} color={colors.primaryDark} />}
            value={appSettings.biometricLock}
            onValueChange={(value) => updateSetting("biometricLock", value)}
            last
          />
        </AppCard>
      </View>
    </ScrollView>
  );
}

function SettingRow({
  title,
  subtitle,
  icon,
  value,
  onValueChange,
  last,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.settingRow, !last && styles.settingRowBorder]}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.disabled }}
        thumbColor={value ? colors.primary : colors.white}
      />
    </View>
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
  sectionBlock: {
    gap: spacing.sm,
  },
  settingsCard: {
    padding: 0,
    overflow: "hidden",
  },
  settingRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  settingCopy: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.textSubtle,
  },
});
