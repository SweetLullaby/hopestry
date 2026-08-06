import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function LaptopScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const laptop = new THREE.Group()
    scene.add(laptop)

    const caseMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a1a,
      shininess: 100,
    })
    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: 0x221144,
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
    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      scrollPercent = window.scrollY / (maxScroll || 1)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const targetRotation = -scrollPercent * Math.PI * 0.7
      lidGroup.rotation.x = THREE.MathUtils.lerp(
        lidGroup.rotation.x,
        targetRotation,
        0.1,
      )
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
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="pointer-events-auto h-full max-h-[80vh] w-full max-w-4xl object-contain">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}
