import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

function createScreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  const draw = (hover: 'pear' | 'blindo' | null) => {
    ctx.fillStyle = '#0a0618'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // soft glow
    const glow = ctx.createRadialGradient(512, 360, 40, 512, 360, 420)
    glow.addColorStop(0, 'rgba(80, 60, 180, 0.35)')
    glow.addColorStop(1, 'rgba(10, 6, 24, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const drawButton = (
      label: string,
      y: number,
      key: 'pear' | 'blindo',
    ) => {
      const x = 262
      const w = 500
      const h = 110
      const r = 18
      const active = hover === key

      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath()
      ctx.fillStyle = active ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)'
      ctx.fill()
      ctx.strokeStyle = active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#e5e2e3'
      ctx.font = '600 54px Montserrat, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x + w / 2, y + h / 2)
    }

    drawButton('Pear', 250, 'pear')
    drawButton('Blindo', 400, 'blindo')

    texture.needsUpdate = true
  }

  draw(null)
  return { canvas, texture, draw }
}

/** Map UV to which product button was hit, if any */
function hitTest(uv: THREE.Vector2): 'pear' | 'blindo' | null {
  const x = uv.x * 1024
  const y = (1 - uv.y) * 768
  const inButton = (by: number) =>
    x >= 262 && x <= 762 && y >= by && y <= by + 110
  if (inButton(250)) return 'pear'
  if (inButton(400)) return 'blindo'
  return null
}

export default function LaptopScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

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

    const { texture, draw } = createScreenTexture()
    const screenMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: new THREE.Color(0x221144),
      emissiveMap: texture,
      emissiveIntensity: 0.85,
      shininess: 40,
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
    display.name = 'screen'
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
    onScroll()

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hovered: 'pear' | 'blindo' | null = null

    const setPointerFromEvent = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const pick = () => {
      // Only interactive once laptop is reasonably open
      if (scrollPercent < 0.35) return null
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(display)
      if (!hits.length || !hits[0].uv) return null
      return hitTest(hits[0].uv)
    }

    const onPointerMove = (event: PointerEvent) => {
      setPointerFromEvent(event)
      const next = pick()
      if (next !== hovered) {
        hovered = next
        draw(hovered)
        container.style.cursor = hovered ? 'pointer' : 'default'
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      setPointerFromEvent(event)
      const target = pick()
      if (target === 'pear') navigate('/pear')
      if (target === 'blindo') navigate('/blindo')
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)

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
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      texture.dispose()
      screenMaterial.dispose()
      caseMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [navigate])

  return (
    <div className="pointer-events-auto h-full max-h-[80vh] w-full max-w-4xl object-contain">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}
