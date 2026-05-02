import React, { useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";

interface FallbackImageProps {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  fallbackIcon: React.ReactNode;
  accessibilityLabel?: string;
}

export function FallbackImage({
  uri,
  style,
  fallbackIcon,
  accessibilityLabel,
}: FallbackImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUri = uri?.trim();

  useEffect(() => {
    setImageFailed(false);
  }, [imageUri]);

  if (imageUri && !imageFailed) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={style}
        accessibilityLabel={accessibilityLabel}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.fallback, style as StyleProp<ViewStyle>]}
    >
      {fallbackIcon}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
