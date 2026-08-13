import { createTheme } from "@mui/material/styles";

import {
  breakpoints,
  colors,
  fonts,
  radius,
  shadows,
  spacing,
  transitions,
} from "./tokens";
import { typography } from "./typography";

const theme = createTheme({
  breakpoints,
  spacing: (factor: number) => `${factor * 4}px`,
  shape: {
    borderRadius: radius.md,
  },
  typography,
  palette: {
    mode: "light",
    primary: {
      main: colors.action,
      light: colors.actionHover,
      dark: colors.action,
      contrastText: colors.onAction,
    },
    secondary: {
      main: colors.accent,
      light: colors.accentSoft,
      dark: colors.accentPressed,
      contrastText: colors.onAction,
    },
    error: {
      main: colors.error,
      light: colors.errorBg,
      dark: colors.error,
      contrastText: colors.white,
    },
    warning: {
      main: colors.warning,
      light: colors.warningBg,
      dark: colors.warning,
      contrastText: colors.white,
    },
    info: {
      main: colors.info,
      light: colors.infoBg,
      dark: colors.info,
      contrastText: colors.white,
    },
    success: {
      main: colors.success,
      light: colors.successBg,
      dark: colors.success,
      contrastText: colors.white,
    },
    background: {
      default: colors.bg,
      paper: colors.card,
    },
    text: {
      primary: colors.text,
      secondary: colors.muted,
      disabled: colors.disabledText,
    },
    divider: colors.divider,
    action: {
      hover: colors.surfaceHover,
      disabled: colors.disabledText,
      disabledBackground: colors.disabledBg,
    },
    colors: {
      bg: colors.bg,
      card: colors.card,
      surface: colors.surface,
      surfaceHover: colors.surfaceHover,
      action: colors.action,
      actionHover: colors.actionHover,
      actionMuted: colors.actionMuted,
      accent: colors.accent,
      accentPressed: colors.accentPressed,
      accentSoft: colors.accentSoft,
      meta: colors.meta,
      muted: colors.muted,
      subtle: colors.subtle,
      border: colors.border,
      divider: colors.divider,
      disabledBg: colors.disabledBg,
      disabledText: colors.disabledText,
      successBg: colors.successBg,
      infoBg: colors.infoBg,
    },
    shadow: {
      subtle: shadows.subtle,
      card: shadows.card,
      dropdown: shadows.dropdown,
      modal: shadows.modal,
      focus: shadows.focus,
      recipeCardHover: shadows.recipeCardHover,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: colors.bg,
          color: colors.text,
          fontFamily: fonts.sans,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": {
            animationDuration: "0.01ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.01ms !important",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: `${radius.md}px`,
          textTransform: "none",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "0.02em",
          lineHeight: 1,
          padding: "9px 20px",
          minHeight: 44,
          transition: `background-color ${transitions.fast}, color ${transitions.fast}, box-shadow ${transitions.fast}, opacity ${transitions.fast}`,
          "&:focus-visible": {
            outline: "none",
            boxShadow: shadows.focus,
          },
          "&.Mui-disabled": {
            backgroundColor: colors.disabledBg,
            color: colors.disabledText,
            border: "none",
          },
        },
        contained: {
          boxShadow: "none",
        },
        outlined: {
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          "&:hover": {
            backgroundColor: colors.surfaceHover,
            border: `1px solid ${colors.border}`,
          },
        },
        text: {
          color: colors.action,
          "&:hover": {
            backgroundColor: colors.surface,
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: colors.action,
            color: colors.onAction,
            "&:hover": {
              backgroundColor: colors.actionHover,
            },
            "&:active": {
              backgroundColor: colors.actionHover,
              opacity: 0.82,
            },
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            backgroundColor: colors.accent,
            color: colors.onAction,
            "&:hover": {
              backgroundColor: colors.accentPressed,
            },
            "&:active": {
              backgroundColor: colors.accentPressed,
              opacity: 0.82,
            },
          },
        },
        {
          props: { variant: "sidebar" },
          style: {
            justifyContent: "flex-start",
            borderRadius: `${radius.md}px`,
            marginBottom: `${spacing[3]}px`,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: "none",
            color: colors.text,
            fontWeight: 600,
            fontSize: "14px",
            minHeight: 40,
            "&:hover": {
              backgroundColor: colors.surfaceHover,
              color: colors.text,
            },
          },
        },
        {
          props: { variant: "soft" },
          style: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.text,
            "&:hover": {
              backgroundColor: colors.surfaceHover,
              border: `1px solid ${colors.border}`,
            },
            "&:active": {
              backgroundColor: colors.surfaceHover,
              opacity: 0.82,
            },
          },
        },
        {
          props: { variant: "destructive" },
          style: {
            backgroundColor: colors.accent,
            color: colors.onAction,
            "&:hover": {
              backgroundColor: colors.accentPressed,
            },
            "&:active": {
              backgroundColor: colors.accentPressed,
              opacity: 0.82,
            },
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: 38,
          height: 38,
          borderRadius: 8,
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          color: colors.action,
          transition: `background-color ${transitions.fast}, border-color ${transitions.fast}`,
          "&:hover": {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: colors.subtle,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.card,
          borderRadius: `${radius.md}px`,
          fontFamily: fonts.sans,
          fontSize: "14px",
          color: colors.text,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.border,
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.actionMuted,
            borderWidth: 1.5,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.action,
            borderWidth: 1.5,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.error,
            borderWidth: 1.5,
          },
          "&.Mui-disabled": {
            backgroundColor: colors.disabledBg,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.border,
            },
          },
        },
        input: {
          padding: "9px 12px",
          "&::placeholder": {
            color: colors.subtle,
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "12px",
          color: colors.text,
          "&.Mui-disabled": {
            color: colors.disabledText,
          },
          "&.Mui-error": {
            color: colors.error,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: fonts.sans,
          fontSize: "11px",
          marginTop: 5,
          "&.Mui-error": {
            color: colors.error,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: `${radius.lg}px`,
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: `${radius.lg}px`,
          boxShadow: "none",
          transition: `transform ${transitions.base}, box-shadow ${transitions.base}, border-color ${transitions.base}`,
          "&:hover": {
            borderColor: colors.actionMuted,
            boxShadow: shadows.recipeCardHover,
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "transparent",
      },
      styleOverrides: {
        root: {
          backgroundColor: colors.card,
          color: colors.text,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: "none",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 56,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: `${radius.xl}px`,
          boxShadow: shadows.modal,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.text,
          color: colors.tooltipFg,
          fontFamily: fonts.sans,
          fontSize: "11px",
          lineHeight: 1.4,
          padding: "6px 10px",
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        },
        arrow: {
          color: colors.text,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: fonts.sans,
          fontSize: "13px",
          borderRadius: radius.pill,
          height: "auto",
          padding: "7px 4px",
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          color: colors.muted,
          "&.Mui-disabled": {
            backgroundColor: colors.disabledBg,
            color: colors.disabledText,
            border: "none",
            opacity: 1,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colors.action,
          height: 2,
        },
        root: {
          borderBottom: `1px solid ${colors.border}`,
          minHeight: 44,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: fonts.sans,
          fontSize: "13px",
          fontWeight: 400,
          textTransform: "none",
          color: colors.muted,
          minHeight: 44,
          padding: "10px 20px",
          "&.Mui-selected": {
            color: colors.action,
            fontWeight: 600,
          },
          "&:hover": {
            color: colors.action,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 40,
          height: 22,
          padding: 0,
        },
        switchBase: {
          padding: 3,
          "&.Mui-checked": {
            transform: "translateX(18px)",
            color: colors.white,
            "& + .MuiSwitch-track": {
              backgroundColor: colors.action,
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 16,
          height: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
        },
        track: {
          borderRadius: 11,
          backgroundColor: colors.border,
          opacity: 1,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.border,
          "&.Mui-checked": {
            color: colors.action,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.border,
          "&.Mui-checked": {
            color: colors.action,
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: `${radius.lg}px`,
          boxShadow: shadows.dropdown,
          minWidth: 200,
          overflow: "hidden",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: fonts.sans,
          fontSize: "13px",
          color: colors.text,
          padding: "10px 14px",
          borderBottom: `1px solid ${colors.divider}`,
          "&:last-of-type": {
            borderBottom: "none",
          },
          "&:hover": {
            backgroundColor: colors.surface,
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.divider,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.accent,
          textDecorationColor: colors.accent,
          "&:hover": {
            color: colors.accentPressed,
          },
        },
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    colors: {
      bg: string;
      card: string;
      surface: string;
      surfaceHover: string;
      action: string;
      actionHover: string;
      actionMuted: string;
      accent: string;
      accentPressed: string;
      accentSoft: string;
      meta: string;
      muted: string;
      subtle: string;
      border: string;
      divider: string;
      disabledBg: string;
      disabledText: string;
      successBg: string;
      infoBg: string;
    };
    shadow: {
      subtle: string;
      card: string;
      dropdown: string;
      modal: string;
      focus: string;
      recipeCardHover: string;
    };
  }

  interface PaletteOptions {
    colors?: Partial<Palette["colors"]>;
    shadow?: Partial<Palette["shadow"]>;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    sidebar: true;
    soft: true;
    destructive: true;
  }
}

export default theme;
