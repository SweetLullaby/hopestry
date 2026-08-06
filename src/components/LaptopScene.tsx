import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'

export default function LaptopScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openAmount, setOpenAmount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const laptop = new THREE.Group()
    scene.add(laptop)

    const caseMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a1a,
      shininess: 100,
    })
    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0x0a0614,
      emissive: 0x1a1035,
      emissiveIntensity: 0.9,
      shininess: 20,
    })

    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 3), caseMaterial)
    laptop.add(base)

    const lidGroup = new THREE.Group()
    lidGroup.position.set(0, 0.05, -1.5)
    laptop.add(lidGroup)

    const lid = new THREE.Mesh(new THREE.BoxGeometry(4, 0.05, 3), caseMaterial)
    lid.position.set(0, 0.025, 1.5)
    lidGroup.add(lid)

    const display = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 2.8),
      screenMaterial,
    )
    display.rotation.x = -Math.PI / 2
    display.position.set(0, 0.055, 1.5)
    lidGroup.add(display)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const pointLight = new THREE.PointLight(0x00ffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    camera.position.set(0, 2, 8)
    camera.lookAt(0, 0, 0)

    let scrollPercent = 0
    let lastReported = -1
    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      scrollPercent = window.scrollY / (maxScroll || 1)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const targetRotation = -scrollPercent * Math.PI * 0.7
      lidGroup.rotation.x = THREE.MathUtils.lerp(
        lidGroup.rotation.x,
        targetRotation,
        0.1,
      )

      const nextOpen = Math.min(
        1,
        Math.abs(lidGroup.rotation.x) / (Math.PI * 0.7),
      )
      if (Math.abs(nextOpen - lastReported) > 0.03) {
        lastReported = nextOpen
        setOpenAmount(nextOpen)
      }

      laptop.position.y = Math.sin(Date.now() * 0.001) * 0.1
      laptop.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1
      renderer.render(scene, camera)
    }

    const onResize = () => {
      const width = container.clientWidth || window.innerWidth
      const height = container.clientHeight || window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)
    onResize()
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      screenMaterial.dispose()
      caseMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  const screenVisible = openAmount > 0.4

  return (
    <div className="relative h-full max-h-[80vh] w-full max-w-4xl object-contain">
      <div ref={containerRef} className="h-full w-full" />

      {/* Real HTML on the open screen — reliable & clickable */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] z-20 flex w-[min(52%,280px)] -translate-x-1/2 -translate-y-1/2 flex-col items-stretch gap-3 transition-opacity duration-500 sm:top-[36%] sm:w-[min(46%,320px)] sm:gap-4"
        style={{
          opacity: screenVisible ? 1 : 0,
          pointerEvents: screenVisible ? 'auto' : 'none',
        }}
      >
        <Link
          to="/pear"
          className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-center font-label-caps text-[11px] tracking-[0.18em] text-on-surface backdrop-blur-sm transition hover:bg-white/20 sm:text-[12px]"
        >
          Pear
        </Link>
        <Link
          to="/blindo"
          className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-center font-label-caps text-[11px] tracking-[0.18em] text-on-surface backdrop-blur-sm transition hover:bg-white/20 sm:text-[12px]"
        >
          Blindo
        </Link>
      </div>
    </div>
  )
}
