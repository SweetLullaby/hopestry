import type { ReactNode } from 'react'
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

const label = 'font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-white/40'
const body = 'text-[15px] leading-relaxed text-white/65'
const linkCls =
  'text-[13px] text-white/50 underline-offset-4 transition hover:text-white hover:underline focus-visible:text-white focus-visible:underline'

function Rows({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="flex flex-col border-t border-white/10">
      {items.map((f, i) => (
        <li key={i} className="border-b border-white/10 py-2.5 text-[14px] leading-snug text-white/75">
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
      className="group flex items-baseline justify-between gap-4 border-b border-white/10 py-4"
    >
      <span className={label}>{k}</span>
      <span className="break-all text-right font-[family-name:var(--font-serif)] text-[24px] leading-none text-[#f3f2ed] underline-offset-4 group-hover:underline">
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
            <p className="text-[13px] text-white/45">{t.strobeVenueNote}</p>
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
    case 'contact':
      return {
        kicker: t.site.nav.contact,
        title: t.site.contactTitle,
        body: <p className={body}>{t.site.contactBody}</p>,
        detailsLabel: t.site.reachUs,
        details: (
          <div className="flex flex-col border-t border-white/10">
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
            items={(['pear', 'strobe'] as const).map((p) => (
              <button
                type="button"
                onClick={() => onOpen?.(p)}
                className="group flex w-full items-baseline justify-between gap-4 text-left"
              >
                <span className="font-[family-name:var(--font-serif)] text-[22px] leading-none" style={{ color: SECTION_COLOR[p] }}>
                  {p === 'pear' ? 'pear' : 'Strobe'}
                </span>
                <span className="text-right text-[13px] text-white/50 group-hover:text-white/80">
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

/** Desktop: content set straight onto the page in three columns, under the word. */
export function SectionColumns({
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
    <div className="grid grid-cols-12 gap-x-10 gap-y-8">
      <div className="col-span-12 flex flex-col gap-4 lg:col-span-5">
        <span className={label}>{p.kicker}</span>
        <p
          className="font-[family-name:var(--font-serif)] text-[clamp(26px,2.6vw,38px)] leading-[1.02]"
          style={{ color: id === 'about' ? '#ecebe6' : color }}
        >
          {sectionTagline(id, lang)}
        </p>
        <div className="flex max-w-[34rem] flex-col gap-3">{p.body}</div>
      </div>
      {p.details && (
        <div className={`col-span-6 flex flex-col gap-3 ${p.actions ? 'lg:col-span-4' : 'lg:col-span-7'}`}>
          <span className={label}>{p.detailsLabel}</span>
          {p.details}
        </div>
      )}
      {p.actions && (
        <div className="col-span-6 flex flex-col gap-4 lg:col-span-3">
          <span className={label}>{p.actionsLabel}</span>
          {p.actions}
        </div>
      )}
    </div>
  )
}

/** Mobile: the same content stacked in one column. */
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
          <h2 className="font-[family-name:var(--font-serif)] text-[44px] font-normal leading-[0.95] text-[#f3f2ed]">
            {p.title}
          </h2>
        </div>
      </div>
      {id !== 'about' && (
        <p className="font-[family-name:var(--font-serif)] text-[24px] leading-tight" style={{ color }}>
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
