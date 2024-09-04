export const LOCALES = Object.freeze({
  EN: "en",
  VI: "vi",
});

export const LOCALE_OPTIONS = Object.values(LOCALES).map((locale) => ({
  value: locale,
  label: locale,
}));
