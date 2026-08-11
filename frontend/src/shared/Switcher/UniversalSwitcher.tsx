import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import React from "react";

import { Switcher } from "./LanguageSwitcherStyles";

interface UniversalSwitcherProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const UniversalSwitcher: React.FC<UniversalSwitcherProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <FormControlLabel
      control={
        <Switcher
          checked={checked}
          onChange={onChange}
          slotProps={{
            input: { "aria-label": "universal switch" },
          }}
        />
      }
      label={
        <Typography variant='body2' sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
      }
    />
  );
};

export default UniversalSwitcher;
