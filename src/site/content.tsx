import type { ReactNode } from 'react'
import StoreBadge from '../desktop/StoreBadge'
import { translations, type Lang } from '../desktop/i18n'

export type SectionId = 'about' | 'pear' | 'strobe' | 'mujgan' | 'contact'

export const SECTIONS: SectionId[] = ['about', 'pear', 'strobe', 'mujgan', 'contact']

export const CONTACT_EMAIL = 'contact@hopestry.studio'
export const IG_URL = 'https://www.instagram.com/hopestry.studio'
const PEAR_IG_URL = 'https://www.instagram.com/joinpearr'
const PEAR_APP_STORE_URL = 'https://apps.apple.com/tr/app/pear-daily-friend-moments/id6798768993'
const PEAR_SITE_URL = 'https://daily-drop-oyunv1.web.app'
const STROBE_SITE_URL = 'https://lastnight-6e630.web.app'

export const SECTION_COLOR: Record<SectionId, string> = {
  about: '#ecebe6',
  pear: '#C8F53D',
  strobe: '#ecebe6',
  mujgan: '#ffcf4a',
  contact: '#ffb58f',
}

export function sectionWord(id: SectionId, lang: Lang) {
  if (id === 'about') return 'hopestry'
  if (id === 'contact') return translations[lang].site.contactWord
  if (id === 'mujgan') return 'müjgan'
  return id
}

export function sectionTagline(id: SectionId, lang: Lang) {
  const t = translations[lang]
  if (id === 'pear') return t.pearTagline
  if (id === 'strobe') return t.strobeTagline
  if (id === 'mujgan') return t.mujganTagline
  if (id === 'contact') return t.site.contactTagline
  return t.site.studioTagline
}

const PRODUCT_NAME = { pear: 'pear', strobe: 'Strobe', mujgan: 'Müjgan' } as const

const label = 'text-[14px] md:text-[13px] text-white/40'
const body = 'text-[17px] md:text-[15px] leading-relaxed text-white/70 md:text-white/65'
const linkCls =
  'text-[15px] md:text-[13px] text-white/55 md:text-white/50 underline-offset-4 transition hover:text-white hover:underline focus-visible:text-white focus-visible:underline'

function Rows({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((f, i) => (
        <li key={i} className="text-[16px] md:text-[14px] leading-snug text-white/75">
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
        <a
          key={l.href}
          href={l.href}
          target={l.href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          className={linkCls}
        >
          {l.label}
        </a>
      ))}
    </div>
  )
}

function ContactRow({ href, k, v }: { href: string; k: string; v: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      className="group flex flex-col gap-1"
    >
      <span className={label}>{k}</span>
      <span className="break-all font-[family-name:var(--font-serif)] text-[24px] leading-none text-[#f3f2ed] underline-offset-4 group-hover:underline">
        {v}
      </span>
    </a>
  )
}

type Parts = {
  kicker: string
  title: string
  icon?: string
  body: ReactNode
  detailsLabel?: string
  details?: ReactNode
  actionsLabel?: string
  actions?: ReactNode
}

function parts(id: SectionId, lang: Lang, onOpen?: (id: SectionId) => void): Parts {
  const t = translations[lang]
  switch (id) {
    case 'pear':
      return {
        kicker: t.site.live,
        title: 'pear',
        icon: '/pear-logo.jpeg',
        body: <p className={body}>{t.pearBody}</p>,
        detailsLabel: t.site.features,
        details: <Rows items={t.pearFeatures} />,
        actionsLabel: t.site.download,
        actions: (
          <>
            <div className="flex flex-wrap gap-3">
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
          </>
        ),
      }
    case 'strobe':
      return {
        kicker: t.soon,
        title: 'Strobe',
        icon: '/strobe-icon.png',
        body: (
          <>
            <p className={body}>{t.strobeBody}</p>
            <p className="text-[15px] md:text-[13px] text-white/45">{t.strobeVenueNote}</p>
          </>
        ),
        detailsLabel: t.site.features,
        details: <Rows items={t.strobeFeatures} />,
        actionsLabel: t.site.download,
        actions: (
          <>
            <div className="flex flex-wrap gap-3">
              <StoreBadge store="apple" small={t.storeAppleSmall} name="App Store" note={t.soon} />
              <StoreBadge store="google" small={t.storeGoogleSmall} name="Google Play" note={t.soon} />
            </div>
            <Links
              items={[
                { href: `${STROBE_SITE_URL}/gizlilik`, label: t.strobeLinks.privacy },
                { href: `${STROBE_SITE_URL}/kosullar`, label: t.strobeLinks.terms },
              ]}
            />
          </>
        ),
      }
    case 'mujgan':
      return {
        kicker: t.soon,
        title: 'Müjgan Social',
        icon: '/mujgan-icon.png',
        body: (
          <>
            <p className={body}>{t.mujganBody}</p>
            <p className="text-[15px] md:text-[13px] text-white/45">{t.mujganVenueNote}</p>
          </>
        ),
        detailsLabel: t.site.features,
        details: <Rows items={t.mujganFeatures} />,
        actionsLabel: t.site.download,
        actions: (
          <div className="flex flex-wrap gap-3">
            <StoreBadge store="apple" small={t.storeAppleSmall} name="App Store" note={t.soon} />
            <StoreBadge store="google" small={t.storeGoogleSmall} name="Google Play" note={t.soon} />
          </div>
        ),
      }
    case 'contact':
      return {
        kicker: t.site.nav.contact,
        title: t.site.contactTitle,
        body: <p className={body}>{t.site.contactBody}</p>,
        detailsLabel: t.site.reachUs,
        details: (
          <div className="flex flex-col gap-5">
            <ContactRow href={`mailto:${CONTACT_EMAIL}`} k={t.site.email} v={CONTACT_EMAIL} />
            <ContactRow href={IG_URL} k={t.instagram} v="@hopestry.studio" />
          </div>
        ),
      }
    case 'about':
    default:
      return {
        kicker: t.studio,
        title: t.apps.about.title,
        body: <p className={body}>{t.aboutBody}</p>,
        detailsLabel: t.site.products,
        details: (
          <Rows
            items={(['pear', 'strobe', 'mujgan'] as const).map((p) => (
              <button
                type="button"
                onClick={() => onOpen?.(p)}
                className="group flex w-full items-baseline justify-between gap-4 text-left"
              >
                <span className="font-[family-name:var(--font-serif)] text-[26px] md:text-[22px] leading-none" style={{ color: SECTION_COLOR[p] }}>
                  {PRODUCT_NAME[p]}
                </span>
                <span className="text-right text-[15px] md:text-[13px] text-white/50 group-hover:text-white/80">
                  {sectionTagline(p, lang)}
                </span>
              </button>
            ))}
          />
        ),
        actionsLabel: t.site.reachUs,
        actions: (
          <Links
            items={[
              { href: IG_URL, label: '@hopestry.studio' },
              { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
            ]}
          />
        ),
      }
  }
}

/** Section content in one column: the side area on desktop, the page on mobile. */
export function SectionContent({
  id,
  lang,
  onOpen,
}: {
  id: SectionId
  lang: Lang
  onOpen?: (id: SectionId) => void
}) {
  const p = parts(id, lang, onOpen)
  const color = SECTION_COLOR[id]
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {p.icon && <img src={p.icon} alt="" className="h-14 w-14 rounded-2xl object-cover" draggable={false} />}
        <div className="flex flex-col gap-1">
          <span className={label}>{p.kicker}</span>
          <h2 className="font-[family-name:var(--font-serif)] text-[50px] md:text-[44px] font-normal leading-[0.95] text-[#f3f2ed]">
            {p.title}
          </h2>
        </div>
      </div>
      {id !== 'about' && (
        <p className="font-[family-name:var(--font-serif)] text-[28px] md:text-[24px] leading-tight" style={{ color }}>
          {sectionTagline(id, lang)}
        </p>
      )}
      <div className="flex flex-col gap-3">{p.body}</div>
      {p.details && (
        <div className="flex flex-col gap-3">
          <span className={label}>{p.detailsLabel}</span>
          {p.details}
        </div>
      )}
      {p.actions && <div className="flex flex-col gap-4 pt-1">{p.actions}</div>}
    </div>
  )
}

/** Small red dot drawn after the dotted "strobe" word. */
export const STROBE_DOT = '#ff3b30'

export function sectionAccent(id: SectionId) {
  return id === 'strobe' ? STROBE_DOT : undefined
}
