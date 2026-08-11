import type { CSSProperties } from "react";
import type { TypographyVariantsOptions } from "@mui/material/styles";

import { colors, fonts } from "./tokens";

export const typography: TypographyVariantsOptions = {
  fontFamily: fonts.sans,
  htmlFontSize: 16,

  display: {
    fontFamily: fonts.serif,
    fontSize: "48px",
    fontWeight: 400,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    color: colors.text,
  },
  h1: {
    fontFamily: fonts.serif,
    fontSize: "38px",
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    color: colors.text,
  },
  h2: {
    fontFamily: fonts.serif,
    fontSize: "28px",
    fontWeight: 400,
    lineHeight: 1.25,
    color: colors.text,
  },
  h3: {
    fontFamily: fonts.serif,
    fontSize: "22px",
    fontWeight: 400,
    lineHeight: 1.3,
    color: colors.text,
  },
  h4: {
    fontFamily: fonts.sans,
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.35,
    color: colors.text,
  },
  h5: {
    fontFamily: fonts.serif,
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: 1.3,
    color: colors.text,
  },
  h6: {
    fontFamily: fonts.sans,
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: colors.text,
  },
  subtitle1: {
    fontFamily: fonts.sans,
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: colors.muted,
  },
  subtitle2: {
    fontFamily: fonts.sans,
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: colors.muted,
  },
  body1: {
    fontFamily: fonts.sans,
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: 1.65,
    color: colors.text,
  },
  body2: {
    fontFamily: fonts.sans,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.65,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: "11px",
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.subtle,
  },
  overline: {
    fontFamily: fonts.sans,
    fontSize: "11px",
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: colors.muted,
  },
  button: {
    fontFamily: fonts.sans,
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: "0.02em",
    textTransform: "none",
  },
  bodySmall: {
    fontFamily: fonts.sans,
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: 1.6,
    color: colors.text,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: "11px",
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: colors.text,
  },
};

declare module "@mui/material/styles" {
  interface TypographyVariants {
    display: CSSProperties;
    bodySmall: CSSProperties;
    label: CSSProperties;
  }

  interface TypographyVariantsOptions {
    display?: CSSProperties;
    bodySmall?: CSSProperties;
    label?: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    display: true;
    bodySmall: true;
    label: true;
  }
}
