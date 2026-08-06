import { Link } from 'react-router-dom'

type ProductPageProps = {
  name: string
  blurb: string
}

export default function ProductPage({ name, blurb }: ProductPageProps) {
  return (
    <div className="relative flex min-h-[100svh] flex-col bg-background text-on-surface">
      <header className="flex items-center justify-between px-margin-mobile py-8 md:px-margin-desktop">
        <Link
          to="/"
          className="font-label-caps text-label-caps tracking-[0.4em] text-on-surface transition-opacity hover:opacity-70"
        >
          STUDIO
        </Link>
        <Link
          to="/"
          className="font-label-caps text-label-caps text-on-surface-variant transition-opacity hover:opacity-70"
        >
          Back
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-margin-mobile pb-24 text-center md:px-margin-desktop">
        <h1 className="font-display-mobile text-display-mobile tracking-tighter text-on-surface md:font-display-lg md:text-display-lg">
          {name}
        </h1>
        <p className="mt-6 max-w-md font-body-lg text-body-lg text-on-surface-variant">
          {blurb}
        </p>
      </main>
    </div>
  )
}
