import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Mic, MicOff, PhoneOff, UserRound, Video, Volume2 } from "lucide-react-native";
import { FallbackImage } from "../ui/FallbackImage";
import { Doctor } from "../../types/doctor";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface VideoCallProps {
  doctor: Doctor;
  muted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
}

export function VideoCall({ doctor, muted, onToggleMute, onEndCall }: VideoCallProps) {
  return (
    <View style={styles.wrapper}>
      <FallbackImage
        uri={doctor.image}
        style={styles.heroVideo}
        fallbackIcon={<UserRound size={86} color={colors.white} />}
        accessibilityLabel={`${doctor.name} video preview`}
      />
      <View style={styles.overlay} />

      <View style={styles.header}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.subtitle}>Live consultation</Text>
      </View>

      <View style={styles.previewRow}>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1200",
          }}
          style={styles.preview}
        />
        <Image
          source={{
            uri: "https://images.pexels.com/photos/712521/pexels-photo-712521.jpeg?auto=compress&cs=tinysrgb&w=1200",
          }}
          style={styles.preview}
        />
      </View>

      <View style={styles.controls}>
        <ControlButton onPress={onToggleMute} danger={false}>
          {muted ? <MicOff color={colors.text} size={20} /> : <Mic color={colors.text} size={20} />}
        </ControlButton>
        <ControlButton onPress={() => undefined} danger={false}>
          <Video color={colors.text} size={20} />
        </ControlButton>
        <ControlButton onPress={() => undefined} danger={false}>
          <Volume2 color={colors.text} size={20} />
        </ControlButton>
        <ControlButton onPress={onEndCall} danger>
          <PhoneOff color={colors.white} size={20} />
        </ControlButton>
      </View>
    </View>
  );
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
    backgroundColor: colors.text,
  },
  heroVideo: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 38, 58, 0.38)",
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
    color: "rgba(255, 255, 255, 0.9)",
  },
  previewRow: {
    position: "absolute",
    bottom: 118,
    left: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  preview: {
    width: 74,
    height: 94,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.65)",
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
