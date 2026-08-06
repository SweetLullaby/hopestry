import ShaderBackground from './components/ShaderBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-[300vh]">
      <ShaderBackground />
      <Navbar />
      <Hero />
      <div id="work" className="h-[200vh]" aria-hidden />
      <Footer />
    </div>
  )
}
