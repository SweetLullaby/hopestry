import type { Lang } from './i18n'

type LanguageSwitcherProps = {
  lang: Lang
  onChange: (lang: Lang) => void
}

export default function LanguageSwitcher({ lang, onChange }: LanguageSwitcherProps) {
  return (
    <div
      className="flex items-center rounded-full border border-white/15 bg-white/10 p-0.5"
      role="group"
      aria-label="Language"
    >
      {(['tr', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide transition ${
            lang === code
              ? 'bg-white/90 text-[var(--desk)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
