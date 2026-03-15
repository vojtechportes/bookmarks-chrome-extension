import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from "./constants";
import { initReactI18next } from "react-i18next";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: "languageOnly",
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ["common"],
    defaultNS: "common",
    detection: {
      order: ["navigator"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      bindI18n: "languageChanged",
      useSuspense: true,
    },
  });

export default i18next