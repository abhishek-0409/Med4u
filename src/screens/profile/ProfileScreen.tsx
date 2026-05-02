import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  CalendarClock,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  LogOut,
  Settings,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react-native";
import { AppointmentCard } from "../../components/doctor/AppointmentCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { Avatar } from "../../components/ui/Avatar";
import { SectionTitle } from "../../components/ui/SectionTitle";
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
  const cartCount = useUserStore((state) => state.cart.reduce((total, item) => total + item.quantity, 0));
  const prescriptions = useUserStore((state) => state.prescriptions);
  const { logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AppHeader
        eyebrow="Account"
        title="My Profile"
        subtitle="Manage your health records, orders and settings."
      />

      <AppCard style={styles.profileCard}>
        <Avatar uri={profile.avatar} name={profile.name} size={84} />
        <View style={styles.profileCopy}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.meta}>{profile.phone}</Text>
          <Text style={styles.meta}>{profile.email}</Text>
          <View style={styles.memberPill}>
            <ShieldCheck size={14} color={colors.primaryDark} />
            <Text style={styles.memberText}>Med4U Member</Text>
          </View>
        </View>
      </AppCard>

      <View style={styles.statsRow}>
        <StatItem label="Age" value={String(profile.age)} />
        <StatItem label="Blood" value={profile.bloodGroup} />
        <StatItem label="Orders" value={String(cartCount)} />
        <StatItem label="Records" value={String(prescriptions.length)} />
      </View>

      {appointments[0] ? (
        <View style={styles.sectionBlock}>
          <SectionTitle title="Upcoming Appointment" />
          <AppointmentCard appointment={appointments[0]} />
        </View>
      ) : null}

      <View style={styles.sectionBlock}>
        <SectionTitle title="Orders" subtitle="Appointments, medicines and diagnostics" />
        <AppCard style={styles.menuCard}>
          <MenuItem
            label="Appointments"
            meta={`${appointments.length} booked`}
            icon={<CalendarClock size={18} color={colors.primaryDark} />}
            onPress={() => navigation.navigate("DoctorList")}
          />
          <MenuItem
            label="Medicine Orders"
            meta={cartCount ? `${cartCount} item in cart` : "Browse medicines"}
            icon={<ShoppingBag size={18} color={colors.primaryDark} />}
            onPress={() => navigation.navigate("OrderMedicine")}
          />
          <MenuItem
            label="Lab Reports"
            meta="Reports and test status"
            icon={<FlaskConical size={18} color={colors.primaryDark} />}
            onPress={() => navigation.navigate("Reports")}
          />
          <MenuItem
            label="Prescriptions"
            meta={`${prescriptions.length} record${prescriptions.length === 1 ? "" : "s"}`}
            icon={<ClipboardList size={18} color={colors.primaryDark} />}
            onPress={() => navigation.navigate("Prescription")}
            last
          />
        </AppCard>
      </View>

      <View style={styles.sectionBlock}>
        <SectionTitle title="Settings" />
        <AppCard style={styles.menuCard}>
          <MenuItem
            label="Profile Settings"
            meta="Personal and medical details"
            icon={<UserRound size={18} color={colors.primaryDark} />}
            onPress={() => navigation.navigate("ProfileSettings")}
          />
          <MenuItem
            label="App Settings"
            meta="Notifications and privacy"
            icon={<Settings size={18} color={colors.primaryDark} />}
            onPress={() => navigation.navigate("AppSettings")}
            last
          />
        </AppCard>
      </View>

      <AppButton
        title="Logout"
        variant="danger"
        leftIcon={<LogOut size={18} color={colors.white} />}
        onPress={logout}
      />
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
  meta,
  icon,
  onPress,
  last,
}: {
  label: string;
  meta: string;
  icon: React.ReactNode;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, !last && styles.menuItemBorder, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuCopy}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuMeta}>{meta}</Text>
      </View>
      <ChevronRight size={18} color={colors.textSubtle} />
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  profileCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  name: {
    ...typography.h3,
  },
  meta: {
    ...typography.caption,
    color: colors.label,
  },
  memberPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    marginTop: spacing.xs,
  },
  memberText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  sectionBlock: {
    gap: spacing.sm,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
  menuItem: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuCopy: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  menuMeta: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  pressed: {
    opacity: 0.86,
  },
});
