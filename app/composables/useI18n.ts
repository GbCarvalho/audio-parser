import { useNavigatorLanguage } from '@vueuse/core'
import pt, { type I18nKey } from '~/locales/pt'
import en from '~/locales/en'

const locales = { pt, en } as const
type Locale = keyof typeof locales

export function useI18n() {
  const { language } = useNavigatorLanguage()

  const locale = computed<Locale>(() => {
    const lang = language.value ?? 'pt'
    return lang.startsWith('pt') ? 'pt' : 'en'
  })

  function t(key: I18nKey): string {
    return locales[locale.value][key]
  }

  return { t, locale }
}
