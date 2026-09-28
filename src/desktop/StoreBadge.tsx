type StoreBadgeProps = {
  store: 'apple' | 'google'
  small: string
  name: string
  href?: string
  note?: string
}

function AppleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

function PlayLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 2.6 13.4 12 4 21.4Z" fill="#00c3ff" />
      <path d="M4 2.6 16.6 9.6 13.4 12Z" fill="#00f076" />
      <path d="M4 21.4 16.6 14.4 13.4 12Z" fill="#ff3a44" />
      <path d="M16.6 9.6 21 12 16.6 14.4 13.4 12Z" fill="#ffd400" />
    </svg>
  )
}

export default function StoreBadge({ store, small, name, href, note }: StoreBadgeProps) {
  const className =
    'relative inline-flex h-[46px] items-center gap-2.5 rounded-lg border border-white/25 bg-black px-3.5 text-white transition'
  const content = (
    <>
      {store === 'apple' ? <AppleLogo /> : <PlayLogo />}
      <span className="flex flex-col text-left leading-none">
        <span className="text-[10px] text-white/85">{small}</span>
        <span className="mt-[3px] text-[17px] font-semibold tracking-tight">{name}</span>
      </span>
      {note && (
        <span className="absolute -top-2.5 right-2 rounded-full bg-[var(--panel-ink)] px-2 py-px text-[9px] font-semibold leading-[14px] text-[var(--panel)]">
          {note}
        </span>
      )}
    </>
  )

  if (!href) {
    return (
      <span className={`${className} cursor-default opacity-70`} aria-disabled="true">
        {content}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${className} hover:border-white/50`}
    >
      {content}
    </a>
  )
}
