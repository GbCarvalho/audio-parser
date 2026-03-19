import { useNavigatorLanguage } from '@vueuse/core'
import pt, { type I18nKey } from '~/locales/pt'
import en from '~/locales/en'

const locales = { pt, en } as const
type Locale = keyof typeof locales

export function useI18n() {
  const { language } = useNavigatorLanguage()

  // User-selected locale shared across all components; null means "use browser default"
  const userLocale = useState<Locale | null>('i18n-locale', () => null)

  const locale = computed<Locale>(() => {
    if (userLocale.value) return userLocale.value
    const lang = language.value ?? 'pt'
    return lang.startsWith('pt') ? 'pt' : 'en'
  })

  function t(key: I18nKey): string {
    return locales[locale.value][key]
  }

  function toggleLocale() {
    userLocale.value = locale.value === 'pt' ? 'en' : 'pt'
  }

  return { t, locale, toggleLocale }
}
