export const SUPPORTED_LANGS = ['en', 'ar', 'ckb'] as const
export type AppLang = (typeof SUPPORTED_LANGS)[number]

export const DEFAULT_LANG: AppLang = 'en'

export function isAppLang(value: string | undefined): value is AppLang {
  return !!value && (SUPPORTED_LANGS as readonly string[]).includes(value)
}

export function isRtl(lang: AppLang): boolean {
  return lang === 'ar' || lang === 'ckb'
}

export function localeToBcp47(lang: AppLang): string {
  if (lang === 'ckb') return 'ckb-IQ'
  if (lang === 'ar') return 'ar'
  return 'en'
}

/** Replace first path segment (locale) with `newLang`, keeping the rest of the path. */
export function replaceLocaleInPath(pathname: string, newLang: AppLang): string {
  const m = pathname.match(/^\/(en|ar|ckb)(\/.*)?$/)
  if (!m) return `/${newLang}`
  const rest = m[2] ?? ''
  return `/${newLang}${rest}`
}
