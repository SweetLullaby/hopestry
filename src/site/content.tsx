import StoreBadge from '../desktop/StoreBadge'
import { translations, type Lang } from '../desktop/i18n'

export type SectionId = 'about' | 'pear' | 'strobe' | 'contact'

export const SECTIONS: SectionId[] = ['about', 'pear', 'strobe', 'contact']

export const CONTACT_EMAIL = 'contact@hopestry.studio'
export const IG_URL = 'https://www.instagram.com/hopestry.studio'
const PEAR_IG_URL = 'https://www.instagram.com/joinpearr'
const PEAR_APP_STORE_URL = 'https://apps.apple.com/tr/app/pear-daily-friend-moments/id6798768993'
const PEAR_SITE_URL = 'https://daily-drop-oyunv1.web.app'
const STROBE_SITE_URL = 'https://lastnight-6e630.web.app'

export const SECTION_COLOR: Record<SectionId, string> = {
  about: '#ecebe6',
  pear: '#C8F53D',
  strobe: '#c9b6ff',
  contact: '#ffb58f',
}

export function sectionWord(id: SectionId, lang: Lang) {
  if (id === 'about') return 'hopestry'
  if (id === 'contact') return translations[lang].site.contactWord
  return id
}

export function sectionTagline(id: SectionId, lang: Lang) {
  const t = translations[lang]
  if (id === 'pear') return t.pearTagline
  if (id === 'strobe') return t.strobeTagline
  if (id === 'contact') return t.site.contactTagline
  return t.site.studioTagline
}

const h2 =
  'font-[family-name:var(--font-serif)] text-[44px] font-normal leading-[0.95] tracking-[-0.01em] text-[#f3f2ed]'
const label = 'font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-white/45'
const body = 'text-[15px] leading-relaxed text-white/70'
const linkCls =
  'text-[13px] text-white/50 underline-offset-4 transition hover:text-white hover:underline focus-visible:text-white focus-visible:underline'

function Features({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col border-t border-white/10">
      {items.map((f) => (
        <li key={f} className="border-b border-white/10 py-2.5 text-[14px] leading-snug text-white/75">
          {f}
        </li>
      ))}
    </ul>
  )
}

function Links({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={linkCls}>
          {l.label}
        </a>
      ))}
    </div>
  )
}

export function SectionContent({ id, lang }: { id: SectionId; lang: Lang }) {
  const t = translations[lang]

  switch (id) {
    case 'pear':
      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img src="/pear-logo.jpeg" alt="" className="h-14 w-14 rounded-2xl object-cover" draggable={false} />
            <div className="flex flex-col gap-1">
              <span className={label}>{t.site.live}</span>
              <h2 className={h2}>pear</h2>
            </div>
          </div>
          <p className="font-[family-name:var(--font-serif)] text-[24px] leading-tight text-[#C8F53D]">
            {t.pearTagline}
          </p>
          <p className={body}>{t.pearBody}</p>
          <Features items={t.pearFeatures} />
          <div className="flex flex-wrap gap-3 pt-1">
            <StoreBadge store="apple" small={t.storeAppleSmall} name="App Store" href={PEAR_APP_STORE_URL} />
            <StoreBadge store="google" small={t.storeGoogleSmall} name="Google Play" note={t.soon} />
          </div>
          <Links
            items={[
              { href: `${PEAR_SITE_URL}/support`, label: t.pearLinks.support },
              { href: `${PEAR_SITE_URL}/privacy`, label: t.pearLinks.privacy },
              { href: `${PEAR_SITE_URL}/terms`, label: t.pearLinks.terms },
              { href: PEAR_IG_URL, label: '@joinpearr' },
            ]}
          />
        </div>
      )
    case 'strobe':
      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img src="/strobe-icon.png" alt="" className="h-14 w-14 rounded-2xl object-cover" draggable={false} />
            <div className="flex flex-col gap-1">
              <span className={label}>{t.soon}</span>
              <h2 className={h2}>Strobe</h2>
            </div>
          </div>
          <p className="font-[family-name:var(--font-serif)] text-[24px] leading-tight text-[#c9b6ff]">
            {t.strobeTagline}
          </p>
          <p className={body}>{t.strobeBody}</p>
          <Features items={t.strobeFeatures} />
          <p className="text-[13px] text-white/50">{t.strobeVenueNote}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <StoreBadge store="apple" small={t.storeAppleSmall} name="App Store" note={t.soon} />
            <StoreBadge store="google" small={t.storeGoogleSmall} name="Google Play" note={t.soon} />
          </div>
          <Links
            items={[
              { href: `${STROBE_SITE_URL}/gizlilik`, label: t.strobeLinks.privacy },
              { href: `${STROBE_SITE_URL}/kosullar`, label: t.strobeLinks.terms },
            ]}
          />
        </div>
      )
    case 'contact':
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className={label}>{t.site.nav.contact}</span>
            <h2 className={h2}>{t.site.contactTitle}</h2>
          </div>
          <p className={body}>{t.site.contactBody}</p>
          <div className="flex flex-col border-t border-white/10">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group flex items-baseline justify-between gap-4 border-b border-white/10 py-4"
            >
              <span className={label}>{t.site.email}</span>
              <span className="break-all text-right font-[family-name:var(--font-serif)] text-[24px] leading-none text-[#f3f2ed] underline-offset-4 group-hover:underline">
                {CONTACT_EMAIL}
              </span>
            </a>
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline justify-between gap-4 border-b border-white/10 py-4"
            >
              <span className={label}>{t.instagram}</span>
              <span className="text-right font-[family-name:var(--font-serif)] text-[24px] leading-none text-[#f3f2ed] underline-offset-4 group-hover:underline">
                @hopestry.studio
              </span>
            </a>
          </div>
        </div>
      )
    case 'about':
    default:
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className={label}>{t.studio}</span>
            <h2 className={h2}>{t.apps.about.title}</h2>
          </div>
          <p className={body}>{t.aboutBody}</p>
          <Links
            items={[
              { href: IG_URL, label: '@hopestry.studio' },
              { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
            ]}
          />
        </div>
      )
  }
}
