export type Lang = 'el' | 'en';

export const supportedLangs: Lang[] = ['el', 'en'];

export const defaultLang: Lang = 'el';

export const langLabels: Record<Lang, string> = {
  el: 'Ελληνικά',
  en: 'English',
};

export function getLangFromParam(param: string | undefined): Lang {
  if (param && supportedLangs.includes(param as Lang)) return param as Lang;
  return defaultLang;
}
