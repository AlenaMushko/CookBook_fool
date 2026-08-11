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
      main: colors.sage,
      light: colors.sageHover,
      dark: colors.sage,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.clay,
      light: colors.clayLight,
      dark: colors.clayDark,
      contrastText: colors.white,
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
      hover: colors.surfaceAlt,
      disabled: colors.disabledText,
      disabledBackground: colors.disabledBg,
    },
    colors: {
      bg: colors.bg,
      card: colors.card,
      surface: colors.surface,
      surfaceAlt: colors.surfaceAlt,
      sage: colors.sage,
      sageHover: colors.sageHover,
      sageUi: colors.sageUi,
      clay: colors.clay,
      clayDark: colors.clayDark,
      clayLight: colors.clayLight,
      gold: colors.gold,
      muted: colors.muted,
      subtle: colors.subtle,
      border: colors.border,
      divider: colors.divider,
      disabledBg: colors.disabledBg,
      disabledText: colors.disabledText,
      // aliases used across existing screens
      btnBgHover: colors.sageHover,
      bgLight: colors.bg,
      lightGreen: colors.successBg,
      lightBlue: colors.infoBg,
      lightGray: colors.border,
      darkBlue: colors.info,
      blueBtn: colors.sage,
      blueBtnHover: colors.sageHover,
      greenBtnBg: colors.surface,
      greenBtnHoverBg: colors.surfaceAlt,
      greyText: colors.text,
    },
    shadow: {
      subtle: shadows.subtle,
      card: shadows.card,
      dropdown: shadows.dropdown,
      modal: shadows.modal,
      focus: shadows.focus,
      recipeCardHover: shadows.recipeCardHover,
      orange: shadows.card,
      green: shadows.subtle,
    },
    gradients: {
      green: colors.surface,
      orange: colors.bg,
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
            backgroundColor: colors.surfaceAlt,
            border: `1px solid ${colors.border}`,
          },
        },
        text: {
          color: colors.sage,
          "&:hover": {
            backgroundColor: colors.surface,
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: colors.sage,
            color: colors.white,
            "&:hover": {
              backgroundColor: colors.sageHover,
            },
            "&:active": {
              backgroundColor: colors.sageHover,
              opacity: 0.82,
            },
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            backgroundColor: colors.clay,
            color: colors.white,
            "&:hover": {
              backgroundColor: colors.clayDark,
            },
            "&:active": {
              backgroundColor: colors.clayDark,
              opacity: 0.82,
            },
          },
        },
        {
          props: { variant: "greenButton" },
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
              backgroundColor: colors.surfaceAlt,
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
              backgroundColor: colors.surfaceAlt,
              border: `1px solid ${colors.border}`,
            },
            "&:active": {
              backgroundColor: colors.surfaceAlt,
              opacity: 0.82,
            },
          },
        },
        {
          props: { variant: "destructive" },
          style: {
            backgroundColor: colors.clay,
            color: colors.white,
            "&:hover": {
              backgroundColor: colors.clayDark,
            },
            "&:active": {
              backgroundColor: colors.clayDark,
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
          color: colors.sage,
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
            borderColor: colors.sageUi,
            borderWidth: 1.5,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.sage,
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
            borderColor: colors.sageUi,
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
          backgroundColor: colors.sage,
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
            color: colors.sage,
            fontWeight: 600,
          },
          "&:hover": {
            color: colors.sage,
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
              backgroundColor: colors.sage,
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
            color: colors.sage,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.border,
          "&.Mui-checked": {
            color: colors.sage,
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
          color: colors.clay,
          textDecorationColor: colors.clay,
          "&:hover": {
            color: colors.clayDark,
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
      surfaceAlt: string;
      sage: string;
      sageHover: string;
      sageUi: string;
      clay: string;
      clayDark: string;
      clayLight: string;
      gold: string;
      muted: string;
      subtle: string;
      border: string;
      divider: string;
      disabledBg: string;
      disabledText: string;
      btnBgHover: string;
      bgLight: string;
      lightGreen: string;
      lightGray: string;
      darkBlue: string;
      lightBlue: string;
      greenBtnBg: string;
      greenBtnHoverBg: string;
      greyText: string;
      blueBtn: string;
      blueBtnHover: string;
    };
    shadow: {
      subtle: string;
      card: string;
      dropdown: string;
      modal: string;
      focus: string;
      recipeCardHover: string;
      orange: string;
      green: string;
    };
    gradients: {
      green: string;
      orange: string;
    };
  }

  interface PaletteOptions {
    colors?: Partial<Palette["colors"]>;
    shadow?: Partial<Palette["shadow"]>;
    gradients?: Partial<Palette["gradients"]>;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    greenButton: true;
    soft: true;
    destructive: true;
  }
}

export default theme;
