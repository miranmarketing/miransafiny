import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import ar from '../locales/ar.json'
import ckb from '../locales/ckb.json'
import { DEFAULT_LANG, type AppLang } from '../utils/locale'

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    ckb: { translation: ckb },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
})

export function setInterfaceLanguage(lang: AppLang) {
  void i18n.changeLanguage(lang)
}

export default i18n
