import { cn } from "@/lib/utils";
import * as React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isUk = i18n.language === "uk";

  const setLang = (next: "en" | "uk") => {
    i18n.changeLanguage(next);
  };

  return (
    <div
      role='group'
      aria-label='Language switch EN / УКР'
      className='inline-flex h-[30px] w-[72px] overflow-hidden rounded-md border border-border bg-secondary'
    >
      <button
        type='button'
        onClick={() => setLang("en")}
        className={cn(
          "flex h-full w-1/2 items-center justify-center text-xs font-semibold transition-colors",
          !isUk
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        type='button'
        onClick={() => setLang("uk")}
        className={cn(
          "flex h-full w-1/2 items-center justify-center text-xs font-semibold transition-colors",
          isUk
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        УКР
      </button>
    </div>
  );
};

export default LanguageSwitcher;
