import BackgroundVideo from './components/BackgroundVideo'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  return (
    <div className="relative">
      <BackgroundVideo />
      <Navbar />
      <Hero />
    </div>
  )
}
