const EMAIL = 'contact@hopestry.studio'

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-0 z-50 mx-auto hidden w-full max-w-container-max items-center justify-between bg-transparent px-margin-desktop py-8 backdrop-blur-sm md:flex">
        <div className="font-label-caps text-label-caps tracking-[0.4em] text-on-surface">
          STUDIO
        </div>
        <div className="flex items-center gap-8">
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-on-surface hover:opacity-70"
            href="#work"
          >
            Work
          </a>
          <a
            className="font-label-caps text-label-caps lowercase text-on-surface-variant transition-colors duration-300 hover:text-on-surface hover:opacity-70"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
        </div>
        <div className="cursor-pointer transition-transform duration-300 hover:opacity-70 active:scale-95">
          <span className="material-symbols-outlined text-on-surface">menu</span>
        </div>
      </nav>

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-transparent px-margin-mobile py-8 backdrop-blur-sm md:hidden">
        <div className="font-label-caps text-label-caps tracking-[0.4em] text-on-surface">
          STUDIO
        </div>
        <a
          className="font-label-caps text-[10px] lowercase tracking-[0.12em] text-on-surface-variant transition-opacity hover:opacity-70"
          href={`mailto:${EMAIL}`}
        >
          {EMAIL}
        </a>
      </nav>
    </>
  )
}
