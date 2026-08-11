import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCanvasInView, useIsMobile, usePrefersReducedMotion } from '../../lib/hooks'

function fibonacciSphere(count, radius) {
  const arr = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    arr[i * 3] = Math.cos(theta) * r * radius
    arr[i * 3 + 1] = y * radius
    arr[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return arr
}

function GlobeInner({ pointer, reduced }) {
  const group = useRef(null)
  const points = useRef(null)
  const core = useRef(null)
  const count = 900

  const positions = useMemo(() => fibonacciSphere(count, 1.9), [])
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const a = new THREE.Color('#4f7cff')
    const b = new THREE.Color('#a78bfa')
    const tmp = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const t = (positions[i * 3 + 1] / 1.9 + 1) / 2
      tmp.copy(a).lerp(b, t)
      arr[i * 3] = tmp.r
      arr[i * 3 + 1] = tmp.g
      arr[i * 3 + 2] = tmp.b
    }
    return arr
  }, [positions])

  useFrame((state, delta) => {
    if (reduced || !group.current) return
    const target = pointer.current
    group.current.rotation.y += delta * 0.12 + (target.x - group.current.rotation.y) * 0.04
    group.current.rotation.x += (target.y - group.current.rotation.x) * 0.04
    if (core.current) core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06)
  })

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh ref={core}>
        <sphereGeometry args={[1.15, 24, 24]} />
        <meshBasicMaterial color="#0b1233" transparent opacity={0.85} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.012, 8, 120]} />
        <meshBasicMaterial color="#4f7cff" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0.5, 0]}>
        <torusGeometry args={[2.85, 0.01, 8, 120]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export default function Globe() {
  const [wrapRef, inView] = useCanvasInView()
  const pointer = useRef({ x: 0, y: 0 })
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current.x = ((e.clientX - r.left) / r.width) * 0.9 - 0.45
    pointer.current.y = ((e.clientY - r.top) / r.height) * 0.6 - 0.3
  }

  return (
    <div ref={wrapRef} className="globe-wrap" onMouseMove={onMove}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeInner pointer={pointer} reduced={reduced} />
      </Canvas>
    </div>
  )
}
