export const colors = {
  bg: "#FBF4EA",
  card: "#FFFDF8",
  surface: "#F4EADC",
  surfaceHover: "#EADFC9",

  // Primary action (buttons, active nav, focus, selection)
  action: "#4A5A44",
  actionHover: "#5C6E54",
  actionMuted: "#8B9683",

  // Brand / accent (logo, tags, links, highlights)
  accent: "#B5502B",
  accentPressed: "#7A3B1D",
  accentSoft: "#F0DECF",

  // Metadata / premium accents
  meta: "#C79A56",

  // Typography
  text: "#2B2620",
  muted: "#6B6050",
  subtle: "#8E836D",

  // Structure
  border: "#E6D9C4",
  divider: "#EDE2D0",

  // Semantic states
  success: "#3A6644",
  successBg: "#EDF5EF",
  successBd: "#C3DFC9",

  warning: "#9B6B1E",
  warningBg: "#FDF7ED",
  warningBd: "#EFDDB0",

  error: "#8B2A1A",
  errorBg: "#FDF0EE",
  errorBd: "#F0C4BC",

  info: "#2D5A7A",
  infoBg: "#EAF0EC",
  infoBd: "#B0CDBB",

  disabledBg: "#EDE8E0",
  disabledText: "#B0A898",

  white: "#FFFFFF",
  onAction: "#FFFFFF",
  tooltipFg: "#FAF6ED",
} as const;

export const difficulty = {
  easy: { color: colors.success, bg: colors.successBg },
  medium: { color: colors.warning, bg: colors.warningBg },
  hard: { color: colors.error, bg: colors.errorBg },
} as const;

export const fonts = {
  sans: "'Manrope', sans-serif",
  serif: "'Source Serif 4', serif",
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const radius = {
  sm: 4,
  md: 7,
  lg: 10,
  xl: 12,
  "2xl": 16,
  pill: 9999,
  circle: "50%",
} as const;

export const shadows = {
  flat: "none",
  subtle: "0 1px 4px rgba(43,38,32,0.06)",
  card: "0 2px 8px rgba(43,38,32,0.08), 0 1px 2px rgba(43,38,32,0.04)",
  dropdown: "0 4px 16px rgba(43,38,32,0.1), 0 1px 4px rgba(43,38,32,0.06)",
  modal: "0 8px 40px rgba(43,38,32,0.14), 0 2px 8px rgba(43,38,32,0.06)",
  focus: `0 0 0 2.5px ${colors.action}, 0 0 0 4px ${colors.bg}`,
  recipeCardHover: "0 4px 18px rgba(43,38,32,0.1)",
} as const;

export const breakpoints = {
  values: {
    xs: 0,
    sm: 390,
    md: 768,
    lg: 1280,
    xl: 1440,
  },
} as const;

export const layout = {
  pageMaxWidth: 960,
  pagePaddingX: spacing[12],
  sidebarWidth: 200,
  createFormMaxWidth: 720,
  libraryGridGap: 20,
  gridGap: 18,
} as const;

export const transitions = {
  fast: "0.12s ease",
  base: "0.15s ease",
} as const;

export const iconSizes = {
  caption: 12,
  inline: 14,
  search: 15,
  nav: 16,
  section: 20,
  empty: 24,
  decorative: 32,
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
