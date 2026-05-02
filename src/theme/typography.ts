import { TextStyle } from "react-native";
import { colors } from "./colors";

type Typography = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  title: TextStyle;
  body: TextStyle;
  bodyBold: TextStyle;
  caption: TextStyle;
  button: TextStyle;
};

export const typography: Typography = {
  h1: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    color: colors.text,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400",
    color: colors.textMuted,
  },
  bodyBold: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
    color: colors.textMuted,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.white,
  },
};
