import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/spacing";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name = "User", size = 46 }: AvatarProps) {
  if (uri) {
    return <Image source={{ uri }} style={[styles.image, { width: size, height: size }]} />;
  }

  return (
    <View style={[styles.fallback, { width: size, height: size }]}>
      <Text style={styles.initial}>{name.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  fallback: {
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 16,
  },
});
