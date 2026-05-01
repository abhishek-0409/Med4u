import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  CalendarClock,
  ClipboardList,
  FlaskConical,
  LogOut,
  ShoppingBag,
} from "lucide-react-native";
import { AppointmentCard } from "../../components/doctor/AppointmentCard";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { MainStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<MainStackParamList, "Profile">;

export function ProfileScreen({ navigation }: Props) {
  const profile = useUserStore((state) => state.profile);
  const appointments = useUserStore((state) => state.appointments);
  const { logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient colors={["#2A8E8A", "#2F9FA4"]} style={styles.headerBg} />

      <View style={styles.profileCard}>
        <Avatar uri={profile.avatar} name={profile.name} size={84} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.meta}>{profile.phone}</Text>
        <Text style={styles.meta}>{profile.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Med4U Member</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatItem label="Height" value="5.8 ft" />
        <StatItem label="Weight" value="66 kg" />
        <StatItem label="Age" value={String(profile.age)} />
        <StatItem label="Blood" value={profile.bloodGroup} />
      </View>

      {appointments[0] ? (
        <View style={{ gap: spacing.xs }}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
          <AppointmentCard appointment={appointments[0]} />
        </View>
      ) : null}

      <View style={styles.menuCard}>
        <MenuItem
          label="My Prescriptions"
          icon={<ClipboardList size={18} color={colors.primaryDark} />}
          onPress={() => navigation.navigate("Prescription")}
        />
        <MenuItem
          label="Lab Reports"
          icon={<FlaskConical size={18} color={colors.primaryDark} />}
          onPress={() => navigation.navigate("Reports")}
        />
        <MenuItem
          label="Medicine Orders"
          icon={<ShoppingBag size={18} color={colors.primaryDark} />}
          onPress={() => navigation.navigate("OrderMedicine")}
        />
        <MenuItem
          label="Appointments"
          icon={<CalendarClock size={18} color={colors.primaryDark} />}
          onPress={() => navigation.navigate("DoctorList")}
        />
        <MenuItem
          label="Logout"
          icon={<LogOut size={18} color={colors.danger} />}
          onPress={logout}
          danger
        />
      </View>
    </ScrollView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({
  label,
  icon,
  onPress,
  danger,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.85 }]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={[styles.menuLabel, danger && { color: colors.danger }]}>{label}</Text>
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
  headerBg: {
    height: 164,
    borderRadius: radius.lg,
  },
  profileCard: {
    marginTop: -70,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 4,
    minWidth: 260,
  },
  name: {
    ...typography.title,
    fontSize: 20,
  },
  meta: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  badge: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.mint,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  sectionTitle: {
    ...typography.title,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  menuItem: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 30,
    alignItems: "center",
  },
  menuLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
});
