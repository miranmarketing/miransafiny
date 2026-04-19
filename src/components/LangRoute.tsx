import React, { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { isAppLang, type AppLang } from '../utils/locale'
import { setInterfaceLanguage } from '../i18n/config'

/** Ensures :lang is a supported code and syncs i18n interface language. */
export const LangRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>()

  useEffect(() => {
    if (isAppLang(lang)) setInterfaceLanguage(lang as AppLang)
  }, [lang])

  if (!isAppLang(lang)) {
    return <Navigate to="/en" replace />
  }

  return <>{children}</>
}
