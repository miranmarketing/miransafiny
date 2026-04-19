import React, { useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SUPPORTED_LANGS, isAppLang, replaceLocaleInPath, type AppLang } from '../utils/locale'
import { useTranslation } from 'react-i18next'

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, slug } = useParams<{ lang?: string; slug?: string }>()

  const go = useCallback(
    async (target: AppLang) => {
      const from = isAppLang(lang) ? lang : ('en' as AppLang)
      if (!slug) {
        navigate(`${replaceLocaleInPath(location.pathname, target)}${location.search}`)
        return
      }
      const { data: row } = await supabase
        .from('articles')
        .select('translation_group_id')
        .eq('slug', slug)
        .eq('locale', from)
        .maybeSingle()

      const gid = row?.translation_group_id
      if (!gid) {
        navigate(`/${target}/articles${location.search}`)
        return
      }
      const { data: tr } = await supabase
        .from('articles')
        .select('slug')
        .eq('translation_group_id', gid)
        .eq('locale', target)
        .maybeSingle()

      if (tr?.slug) navigate(`/${target}/articles/${tr.slug}${location.search}`)
      else navigate(`/${target}/articles${location.search}`)
    },
    [lang, location.pathname, location.search, navigate, slug]
  )

  const current = isAppLang(lang) ? lang : 'en'

  return (
    <div className={['flex flex-wrap items-center gap-1', className].filter(Boolean).join(' ')} role="navigation" aria-label="Language">
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => void go(code)}
          className={[
            'px-2 py-1 text-[11px] font-bold tracking-wide rounded border transition-colors',
            current === code
              ? 'bg-[#007BFF] border-[#007BFF] text-white'
              : 'border-white/25 text-white/80 hover:border-white/50 hover:text-white',
          ].join(' ')}
          lang={code === 'ckb' ? 'ckb' : code}
        >
          {t(`lang.${code}`)}
        </button>
      ))}
    </div>
  )
}
