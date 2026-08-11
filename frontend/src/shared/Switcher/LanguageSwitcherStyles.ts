import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

import { colors, fonts } from "../../../theme";

export const Switcher = styled(Switch)(() => ({
  width: 72,
  height: 30,
  padding: 0,
  borderRadius: 7,
  border: `1px solid ${colors.border}`,
  overflow: "hidden",
  backgroundColor: colors.surface,
  "& .MuiSwitch-switchBase": {
    margin: 0,
    padding: 0,
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    borderRadius: 0,
    transform: "none",
    transition: "background-color 0.12s ease",
    "&.Mui-checked": {
      transform: "translateX(100%)",
      color: colors.white,
      "& + .MuiSwitch-track": {
        backgroundColor: colors.surface,
        opacity: 1,
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: colors.sage,
        color: colors.white,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "transparent",
    color: colors.muted,
    width: "100%",
    height: "100%",
    borderRadius: 0,
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    "&::before": {
      content: "attr(data-lang)",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 0,
    backgroundColor: colors.surface,
    opacity: 1,
  },
}));
