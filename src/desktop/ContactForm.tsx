const CONTACT_EMAIL = 'contact@hopestry.studio'

export default function ContactForm() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="font-[family-name:var(--font-display)] text-[22px] font-semibold tracking-tight text-[var(--panel-ink)] underline-offset-4 transition hover:underline sm:text-[24px]"
    >
      {CONTACT_EMAIL}
    </a>
  )
}
