import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import enLocales from "~/../locales/en";
import viLocales from "~/../locales/vi";
import { LOCALES } from "~/constants/locale";
import { getCurrentLocale } from "~/helpers/locale";

i18next.use(initReactI18next).init({
  lng: getCurrentLocale() || LOCALES.EN,
  resources: {
    en: enLocales,
    vi: viLocales,
  },
});
