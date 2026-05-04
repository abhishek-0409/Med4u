import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { MediaStream, RTCView } from "react-native-webrtc";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react-native";
import { Doctor } from "../../types/doctor";
import { CallStatus } from "../../hooks/useVideoCall";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface VideoCallProps {
  doctor: Doctor;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  status: CallStatus;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

export function VideoCall({
  doctor,
  localStream,
  remoteStream,
  status,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}: VideoCallProps) {
  return (
    <View style={styles.wrapper}>
      {/* ── Remote video (full-screen background) ── */}
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
          mirror={false}
        />
      ) : (
        <View style={styles.remoteVideoPlaceholder}>
          {(status === "waiting" || status === "connecting" || status === "joining") && (
            <View style={styles.waitingBox}>
              <ActivityIndicator color={colors.white} size="large" />
              <Text style={styles.waitingText}>{statusLabel(status, doctor.name)}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.overlay} pointerEvents="none" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.subtitle}>
          {status === "connected" ? "Live consultation" : statusLabel(status, doctor.name)}
        </Text>
      </View>

      {/* ── Local video (picture-in-picture) ── */}
      {localStream && !isCameraOff ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
          mirror={true}
          zOrder={1}
        />
      ) : (
        <View style={[styles.localVideo, styles.localVideoOff]}>
          <VideoOff size={22} color={colors.white} />
        </View>
      )}

      {/* ── Controls ── */}
      <View style={styles.controls}>
        <ControlButton onPress={onToggleMute}>
          {isMuted
            ? <MicOff color={colors.text} size={20} />
            : <Mic color={colors.text} size={20} />}
        </ControlButton>
        <ControlButton onPress={onToggleCamera}>
          {isCameraOff
            ? <VideoOff color={colors.text} size={20} />
            : <Video color={colors.text} size={20} />}
        </ControlButton>
        <ControlButton onPress={onEndCall} danger>
          <PhoneOff color={colors.white} size={20} />
        </ControlButton>
      </View>
    </View>
  );
}

function statusLabel(status: CallStatus, doctorName: string): string {
  switch (status) {
    case "joining":    return "Joining room…";
    case "waiting":    return `Waiting for ${doctorName}…`;
    case "connecting": return "Connecting…";
    case "ended":      return "Call ended";
    case "error":      return "Connection error";
    default:           return "";
  }
}

function ControlButton({
  children,
  onPress,
  danger,
}: {
  children: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.controlButton,
        danger && styles.controlButtonDanger,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: "#0a1628",
  },
  remoteVideo: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  remoteVideoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a1628",
  },
  waitingBox: {
    alignItems: "center",
    gap: spacing.md,
  },
  waitingText: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 38, 58, 0.28)",
  },
  header: {
    paddingTop: spacing.xl + 10,
    alignItems: "center",
    gap: 4,
  },
  name: {
    ...typography.h3,
    color: colors.white,
  },
  subtitle: {
    ...typography.body,
    color: "rgba(255,255,255,0.9)",
  },
  localVideo: {
    position: "absolute",
    bottom: 118,
    right: spacing.md,
    width: 90,
    height: 120,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.65)",
    overflow: "hidden",
    zIndex: 10,
  },
  localVideoOff: {
    backgroundColor: "#1a2a40",
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  controlButton: {
    width: 54,
    height: 54,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  controlButtonDanger: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.8,
  },
});
