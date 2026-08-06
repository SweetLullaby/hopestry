import LaptopScene from './LaptopScene'

export default function Hero() {
  return (
    <main className="pointer-events-none fixed inset-0 z-0 flex flex-col items-center justify-center">
      <div className="pointer-events-auto absolute inset-0 flex h-full w-full items-center justify-center">
        <LaptopScene />
      </div>
      <div className="relative z-10 mt-[40vh] flex flex-col items-center md:mt-[50vh]">
        <h1 className="hero-text-fade text-center font-display-mobile text-display-mobile tracking-tighter text-on-surface md:font-display-lg md:text-display-lg">
          hopestry
        </h1>
      </div>
    </main>
  )
}
