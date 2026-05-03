import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
  HeartPulse,
  Home,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  TestTube2,
  UserRound,
  Video,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DoctorCard } from "../../components/doctor/DoctorCard";
import { AppointmentCard } from "../../components/doctor/AppointmentCard";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { Avatar } from "../../components/ui/Avatar";
import { FallbackImage } from "../../components/ui/FallbackImage";
import { Loader } from "../../components/ui/Loader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { doctorService } from "../../services/doctor.service";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, shadows, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { Doctor } from "../../types/doctor";
import { MainStackParamList } from "../../types/navigation";
import { DOCTOR_CATEGORIES, QUICK_ACTIONS } from "../../utils/constants";
import { getGreeting } from "../../utils/helpers";

type Props = NativeStackScreenProps<MainStackParamList, "Home">;

const categoryIcons = [Stethoscope, HeartPulse, TestTube2, Pill, FileText, Stethoscope];

const actionIcons = {
  DoctorList: Stethoscope,
  OrderMedicine: Pill,
  BookTest: TestTube2,
} as const;

const actionCopy = {
  DoctorList: { label: "Doctor", subtitle: "Consult online" },
  OrderMedicine: { label: "Medicines", subtitle: "Order essentials" },
  BookTest: { label: "Lab Tests", subtitle: "Book at home" },
} as const;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const profile = useUserStore((state) => state.profile);
  const appointments = useUserStore((state) => state.appointments);
  const firstName = profile.name.split(" ")[0] || "User";

  useEffect(() => {
    (async () => {
      const doctors = await doctorService.getFeaturedDoctors();
      setFeaturedDoctors(doctors);
      setLoading(false);
    })();
  }, []);

  const filteredFeaturedDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return featuredDoctors;
    }

    return featuredDoctors.filter((doctor) =>
      `${doctor.name} ${doctor.specialization} ${doctor.category}`.toLowerCase().includes(query),
    );
  }, [featuredDoctors, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: 112 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          eyebrow={getGreeting(firstName)}
          title={`Hello, ${firstName}`}
          subtitle="Your care, medicines and tests are one tap away."
          rightElement={
            <View style={styles.headerActions}>
              <Pressable style={styles.iconButton}>
                <Bell size={18} color={colors.primaryDark} />
              </Pressable>
              <Pressable onPress={() => navigation.navigate("Profile")}>
                <Avatar uri={profile.avatar} name={profile.name} size={48} />
              </Pressable>
            </View>
          }
        />

        <View style={styles.searchBar}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search doctors or specializations"
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
          />
        </View>

        {appointments[0] ? (
          <AppCard style={styles.calloutCard}>
            <View style={styles.calloutInfo}>
              <View style={styles.calloutBadge}>
                <CalendarDays size={13} color={colors.primaryDark} />
                <Text style={styles.calloutBadgeText}>Upcoming Session</Text>
              </View>
              <Text style={styles.calloutName}>{appointments[0].doctorName}</Text>
              <Text style={styles.calloutTime}>
                {appointments[0].date} - {appointments[0].time}
              </Text>
              <Pressable
                style={styles.calloutButton}
                onPress={() => {
                  const appt = appointments[0];
                  if (!appt?.id || !appt?.doctorId) return;
                  navigation.navigate("VideoConsult", {
                    doctorId: appt.doctorId,
                    appointmentId: appt.id,
                    role: "patient",
                  });
                }}
              >
                <Text style={styles.calloutButtonText}>Join Call</Text>
                <ChevronRight size={16} color={colors.white} />
              </Pressable>
            </View>
            <FallbackImage
              uri={appointments[0].doctorImage}
              style={styles.calloutImage}
              fallbackIcon={<UserRound size={34} color={colors.primaryDark} />}
              accessibilityLabel={`${appointments[0].doctorName} profile picture`}
            />
          </AppCard>
        ) : null}

        <SectionTitle title="Quick Actions" subtitle="Fast access to everyday care" />
        <View style={styles.quickGrid}>
          <Pressable
            style={({ pressed }) => [styles.quickItem, pressed && styles.pressed]}
            onPress={() => navigation.navigate("VideoConsult", {} as any)}
          >
            <View style={styles.quickIconWrap}>
              <Video size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.quickLabel}>Video Call</Text>
            <Text style={styles.quickSub}>Test camera</Text>
          </Pressable>
          {QUICK_ACTIONS.map((action) => {
            const Icon = actionIcons[action.route];
            const copy = actionCopy[action.route];

            return (
              <Pressable
                key={action.id}
                style={({ pressed }) => [styles.quickItem, pressed && styles.pressed]}
                onPress={() => navigation.navigate(action.route)}
              >
                <View style={styles.quickIconWrap}>
                  <Icon size={20} color={colors.primaryDark} />
                </View>
                <Text style={styles.quickLabel}>{copy.label}</Text>
                <Text style={styles.quickSub}>{copy.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle title="Specialities" actionLabel="All doctors" onActionPress={() => navigation.navigate("DoctorList")} />
        <FlatList
          data={DOCTOR_CATEGORIES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item, index }) => {
            const Icon = categoryIcons[index % categoryIcons.length];
            return (
              <Pressable
                style={({ pressed }) => [styles.categoryChip, pressed && styles.pressed]}
                onPress={() => navigation.navigate("DoctorList", { category: item })}
              >
                <Icon size={15} color={colors.primaryDark} />
                <Text style={styles.categoryText}>{item}</Text>
              </Pressable>
            );
          }}
        />

        <AppCard style={styles.trustCard}>
          <View style={styles.trustIcon}>
            <ShieldCheck size={20} color={colors.primaryDark} />
          </View>
          <View style={styles.trustCopy}>
            <Text style={styles.trustTitle}>Verified care network</Text>
            <Text style={styles.trustText}>Top-rated doctors, genuine medicines and certified lab partners.</Text>
          </View>
        </AppCard>

        <SectionTitle
          title="Popular Doctors"
          subtitle="Available for online consultation"
          actionLabel="See all"
          onActionPress={() => navigation.navigate("DoctorList")}
        />

        {filteredFeaturedDoctors.length === 0 ? (
          <AppCard style={styles.emptyCard}>
            <Search size={22} color={colors.primaryDark} />
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptyText}>Try searching by name, specialty or category.</Text>
          </AppCard>
        ) : (
          <View style={styles.verticalDoctorList}>
            {filteredFeaturedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                variant="list"
                onPress={() => navigation.navigate("DoctorDetail", { doctorId: doctor.id })}
                onBookNow={() => navigation.navigate("BookDoctor", { doctorId: doctor.id })}
              />
            ))}
          </View>
        )}

        {appointments[0] ? (
          <View style={styles.appointmentBlock}>
            <SectionTitle title="Appointment Summary" />
            <AppointmentCard appointment={appointments[0]} />
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.bottomDock, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.xs }]}>
        <DockItem label="Home" icon={Home} active />
        <DockItem label="Doctors" icon={Stethoscope} onPress={() => navigation.navigate("DoctorList")} />
        <DockItem label="Records" icon={FileText} onPress={() => navigation.navigate("Prescription")} />
        <DockItem label="Profile" icon={UserRound} onPress={() => navigation.navigate("Profile")} />
      </View>
    </View>
  );
}

function DockItem({
  label,
  icon: Icon,
  onPress,
  active = false,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  onPress?: () => void;
  active?: boolean;
}) {
  return (
    <Pressable style={styles.dockItem} onPress={onPress}>
      <View style={[styles.dockIcon, active && styles.dockIconActive]}>
        <Icon size={18} color={active ? colors.white : colors.textMuted} />
      </View>
      <Text style={[styles.dockLabel, active && styles.dockLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  searchBar: {
    minHeight: 54,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.text,
  },
  calloutCard: {
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkCard,
    borderColor: "transparent",
  },
  calloutInfo: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
  },
  calloutBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
  },
  calloutBadgeText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  calloutName: {
    ...typography.title,
    color: colors.white,
  },
  calloutTime: {
    ...typography.caption,
    color: "rgba(255,255,255,0.88)",
  },
  calloutButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    marginTop: spacing.xxs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.34)",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  calloutButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
  },
  calloutImage: {
    width: 88,
    height: 96,
    borderRadius: radius.lg,
  },
  quickGrid: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  quickItem: {
    flex: 1,
    minHeight: 128,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    justifyContent: "space-between",
    ...shadows.soft,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  quickSub: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  categoryList: {
    gap: spacing.xs,
    paddingRight: spacing.lg,
  },
  categoryChip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "600",
  },
  trustCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
  },
  trustIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  trustCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  trustTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  trustText: {
    ...typography.caption,
    color: colors.label,
  },
  verticalDoctorList: {
    gap: spacing.sm,
  },
  emptyCard: {
    alignItems: "center",
    gap: spacing.xs,
  },
  emptyTitle: {
    ...typography.bodyBold,
  },
  emptyText: {
    ...typography.caption,
    textAlign: "center",
  },
  appointmentBlock: {
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.86,
  },
  bottomDock: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    ...shadows.card,
  },
  dockItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 64,
  },
  dockIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  dockIconActive: {
    backgroundColor: colors.primary,
  },
  dockLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  dockLabelActive: {
    color: colors.text,
    fontWeight: "700",
  },
});
