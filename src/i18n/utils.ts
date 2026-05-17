export type Lang = 'el' | 'en' | 'de' | 'ru' | 'ja';

export const supportedLangs: Lang[] = ['el', 'en', 'de', 'ru', 'ja'];

export const defaultLang: Lang = 'el';

export const langLabels: Record<Lang, string> = {
  el: 'Ελληνικά',
  en: 'English',
  de: 'Deutsch',
  ru: 'Русский',
  ja: '日本語',
};

export function getLangFromParam(param: string | undefined): Lang {
  if (param && supportedLangs.includes(param as Lang)) return param as Lang;
  return defaultLang;
}
