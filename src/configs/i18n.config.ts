import i18n from 'i18next';
import { Cookies } from 'react-cookie';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const LANGUAGE_COOKIE = 'systemLanguage';
const cookies = new Cookies();

export const appLanguages = [
  { label: 'English', value: 'en', icon: 'circle-flags:uk' },
  { label: 'Bangla', value: 'bangla', icon: 'circle-flags:bd' },
] as const;

const availableLocales = appLanguages.map((lang) => lang.value);
const defaultLocale = 'bangla';

export type Locale = (typeof availableLocales)[number];

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && availableLocales.includes(value as Locale);

const storedLanguage = cookies.get(LANGUAGE_COOKIE);
const initialLanguage: Locale = isLocale(storedLanguage) ? storedLanguage : 'en';

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    returnNull: false,
    fallbackLng: defaultLocale,
    supportedLngs: [...availableLocales],
    ns: ['index'],
    defaultNS: 'index',
    lng: initialLanguage,
    returnEmptyString: false,
    backend: {
      loadPath: '/i18n/{{ns}}/{{lng}}.json',
    },
    interpolation: { escapeValue: false },
    parseMissingKeyHandler: (key) => `${key}`,
  });

i18n.on('languageChanged', (lang) => {
  if (!isLocale(lang)) return;
  cookies.set(LANGUAGE_COOKIE, lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
});

export const setSystemLanguage = (lang: string) => {
  if (!isLocale(lang) || i18n.language === lang) return;
  return i18n.changeLanguage(lang);
};

export default i18n;
