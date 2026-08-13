import "./index.css";

import { store } from "@api/index";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import App from "./App";
import i18n from "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <Toaster position='top-right' richColors closeButton duration={2000} />
          <App />
        </TooltipProvider>
      </I18nextProvider>
    </Provider>
  </StrictMode>
);
