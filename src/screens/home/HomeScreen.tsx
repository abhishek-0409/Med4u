import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  CalendarDays,
  FileText,
  HeartPulse,
  Home,
  MessageCircle,
  Pill,
  Search,
  Stethoscope,
  TestTube2,
  UserRound,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DoctorCard } from "../../components/doctor/DoctorCard";
import { AppointmentCard } from "../../components/doctor/AppointmentCard";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { doctorService } from "../../services/doctor.service";
import { useUserStore } from "../../store/userStore";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
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
  Prescription: CalendarDays,
} as const;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const profile = useUserStore((state) => state.profile);
  const appointments = useUserStore((state) => state.appointments);

  useEffect(() => {
    (async () => {
      const doctors = await doctorService.getFeaturedDoctors();
      setFeaturedDoctors(doctors);
      setLoading(false);
    })();
  }, []);

  const filteredFeaturedDoctors = useMemo(() => {
    if (!search.trim()) {
      return featuredDoctors;
    }
    return featuredDoctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()),
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
          { paddingTop: insets.top + spacing.sm, paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={["#8DCFCB", "#8FC7DC", "#B9DFEC"]} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{getGreeting(profile.name.split(" ")[0])}</Text>
              <Text style={styles.heroTitle}>Find your doctor</Text>
              <Text style={styles.heroSub}>Premium care with fast booking</Text>
            </View>
            <View style={styles.heroActions}>
              <Pressable style={styles.iconPill}>
                <Bell size={16} color={colors.primaryDark} />
              </Pressable>
              <Pressable onPress={() => navigation.navigate("Profile")}>
                <Avatar uri={profile.avatar} name={profile.name} size={46} />
              </Pressable>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color={colors.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search doctor, specialization..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
          </View>
        </LinearGradient>

        {appointments[0] ? (
          <Card style={styles.calloutCard}>
            <View style={styles.calloutInfo}>
              <Text style={styles.calloutLabel}>Upcoming Session</Text>
              <Text style={styles.calloutName}>{appointments[0].doctorName}</Text>
              <Text style={styles.calloutTime}>
                {appointments[0].date} - {appointments[0].time}
              </Text>
              <Pressable
                style={styles.calloutButton}
                onPress={() => navigation.navigate("VideoConsult", { doctorId: appointments[0].doctorId })}
              >
                <Text style={styles.calloutButtonText}>Join Call</Text>
              </Pressable>
            </View>
            <Image source={{ uri: appointments[0].doctorImage }} style={styles.calloutImage} />
          </Card>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

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
                style={styles.categoryChip}
                onPress={() => navigation.navigate("DoctorList", { category: item })}
              >
                <View style={styles.categoryIconWrap}>
                  <Icon size={14} color={colors.primaryDark} />
                </View>
                <Text style={styles.categoryText}>{item}</Text>
              </Pressable>
            );
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => {
            const Icon = actionIcons[action.route];
            return (
              <Pressable
                key={action.id}
                style={({ pressed }) => [styles.quickItem, pressed && { opacity: 0.85 }]}
                onPress={() => navigation.navigate(action.route)}
              >
                <View style={styles.quickIconWrap}>
                  <Icon size={18} color={colors.primaryDark} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
                <Text style={styles.quickSub}>{action.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>

        {appointments[0] ? <AppointmentCard appointment={appointments[0]} /> : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Doctors</Text>
          <Pressable onPress={() => navigation.navigate("DoctorList")}>
            <Text style={styles.link}>See all</Text>
          </Pressable>
        </View>

        {filteredFeaturedDoctors.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No doctors matched your search.</Text>
          </Card>
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
      </ScrollView>

      <View style={[styles.bottomDock, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm }]}>
        <DockItem label="Home" icon={Home} active />
        <DockItem label="Doctors" icon={Stethoscope} onPress={() => navigation.navigate("DoctorList")} />
        <DockItem label="Messages" icon={MessageCircle} />
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
    gap: spacing.lg,
  },
  heroCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  heroActions: {
    alignItems: "center",
    gap: spacing.xs,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
  },
  greeting: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  heroTitle: {
    ...typography.h2,
    marginTop: 2,
  },
  heroSub: {
    ...typography.caption,
    color: colors.text,
    marginTop: 2,
  },
  searchBar: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
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
    paddingHorizontal: spacing.sm,
    gap: 4,
  },
  calloutLabel: {
    ...typography.caption,
    color: "rgba(255,255,255,0.75)",
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
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  calloutButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  calloutImage: {
    width: 88,
    height: 96,
    borderRadius: radius.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.title,
  },
  categoryList: {
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  categoryIconWrap: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    ...typography.caption,
    color: colors.text,
  },
  quickGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  quickIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.aqua,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "600",
  },
  quickSub: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  link: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  verticalDoctorList: {
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
  },
  bottomDock: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.md,
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
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  dockIconActive: {
    backgroundColor: colors.primaryDark,
  },
  dockLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  dockLabelActive: {
    color: colors.text,
    fontWeight: "600",
  },
});

