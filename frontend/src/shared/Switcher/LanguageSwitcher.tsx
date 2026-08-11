import FormControlLabel from "@mui/material/FormControlLabel";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Switcher } from "./LanguageSwitcherStyles";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const [language, setLanguage] = React.useState<"EN" | "UK">(
    i18n.language === "uk" ? "UK" : "EN"
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguage = event.target.checked ? "UK" : "EN";
    setLanguage(newLanguage);

    i18n.changeLanguage(newLanguage === "UK" ? "uk" : "en");
  };

  return (
    <FormControlLabel
      control={
        <Switcher
          checked={language === "UK"}
          onChange={handleChange}
          data-lang={language === "UK" ? "УКР" : "EN"}
          slotProps={{
            input: { "aria-label": "Language switch EN / УКР" },
          }}
        />
      }
      label=''
      sx={{ m: 0 }}
    />
  );
};

export default LanguageSwitcher;
