import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { UserRound } from "lucide-react-native";
import { colors } from "../../theme/colors";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name = "User", size = 46 }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarUri = uri?.trim();

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUri]);

  if (avatarUri && !imageFailed) {
    return (
      <Image
        source={{ uri: avatarUri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <View
      accessibilityLabel={`${name} default profile picture`}
      style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <UserRound size={Math.max(18, Math.round(size * 0.48))} color={colors.primaryDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.border,
  },
  fallback: {
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
