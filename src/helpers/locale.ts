import { LOCALES } from "~/constants/locale";

export type ValueOf<T> = Required<T>[keyof T];

// eslint-disable-next-line import/prefer-default-export
export const getCurrentLocale = (): string | null => {
  return localStorage.getItem("locale") || null;
};

export const setCurrentLocale = (locale: ValueOf<typeof LOCALES>) => {
  localStorage.setItem("locale", locale);
};
