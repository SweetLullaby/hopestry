export default function Footer() {
  return (
    <footer
      id="contact"
      className="absolute bottom-0 z-40 flex w-full flex-col items-center justify-center gap-4 bg-transparent py-margin-mobile"
    >
      <div className="flex gap-6">
        <a
          className="font-body-sm text-body-sm text-on-secondary-container opacity-50 transition-opacity duration-500 hover:opacity-100"
          href="#"
        >
          Instagram
        </a>
        <a
          className="font-body-sm text-body-sm text-on-secondary-container opacity-50 transition-opacity duration-500 hover:opacity-100"
          href="#"
        >
          LinkedIn
        </a>
        <a
          className="font-body-sm text-body-sm text-on-secondary-container opacity-50 transition-opacity duration-500 hover:opacity-100"
          href="#"
        >
          Behance
        </a>
      </div>
      <div className="font-body-sm text-body-sm text-on-surface-variant">
        © 2024 DIGITAL BOUTIQUE
      </div>
    </footer>
  )
}
