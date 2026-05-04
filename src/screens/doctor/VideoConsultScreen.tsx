import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { VideoCall } from "../../components/video/VideoCall";
import { doctorService } from "../../services/doctor.service";
import { useVideoCall } from "../../hooks/useVideoCall";
import { Doctor } from "../../types/doctor";
import { MainStackParamList } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<MainStackParamList, "VideoConsult">;

export function VideoConsultScreen({ route, navigation }: Props) {
  const { doctorId, appointmentId, role } = route.params ?? ({} as any);
  const [doctor, setDoctor] = useState<Doctor | undefined>();

  const isDemoMode = !appointmentId || !doctorId;
  const paramsValid = !isDemoMode &&
    typeof appointmentId === "string" && appointmentId.length > 8 &&
    typeof doctorId === "string" && doctorId.length > 8;

  useEffect(() => {
    if (isDemoMode) {
      setDoctor({ id: "demo", name: "Doctor", specialization: "General", category: "General", rating: 5, experienceYears: 5, patients: "100+", fee: 500, location: "India", image: "", about: "", reviews: [], slots: [] });
      return;
    }
    if (!paramsValid) return;
    doctorService.getDoctorById(doctorId).then(setDoctor);
  }, [doctorId, paramsValid, isDemoMode]);

  const handleCallEnded = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {
    localStream,
    remoteStream,
    status,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    endCall,
    error,
  } = useVideoCall({
    appointmentId: isDemoMode ? "00000000-0000-0000-0000-000000000000" : appointmentId,
    role: role ?? "patient",
    onCallEnded: handleCallEnded,
  });

  if (!doctor) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoCall
        doctor={doctor}
        localStream={localStream}
        remoteStream={remoteStream}
        status={status}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
        onEndCall={endCall}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    textAlign: "center",
  },
});
