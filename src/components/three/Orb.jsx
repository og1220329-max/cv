import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCanvasInView, useIsMobile, usePrefersReducedMotion } from '../../lib/hooks'

function OrbInner({ pointer, reduced }) {
  const group = useRef(null)
  const shell = useRef(null)
  const core = useRef(null)
  const ring = useRef(null)
  const points = useRef(null)

  const positions = useMemo(() => {
    const count = 500
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 0.9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r
      arr[i * 3 + 2] = Math.cos(phi) * r
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (reduced || !group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y += delta * 0.15 + (pointer.current.x - group.current.rotation.y) * 0.04
    group.current.rotation.x += (pointer.current.y - group.current.rotation.x) * 0.04
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.22
      shell.current.rotation.z += delta * 0.06
    }
    if (ring.current) {
      ring.current.rotation.x = 1.4 + Math.sin(t * 0.5) * 0.12
      ring.current.rotation.z += delta * 0.35
    }
    if (core.current) {
      core.current.rotation.y += delta * 0.4
      core.current.rotation.x += delta * 0.25
      core.current.scale.setScalar(1 + Math.sin(t * 1.1) * 0.05)
    }
    if (points.current) points.current.rotation.y += delta * 0.04
  })

  return (
    <group ref={group}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshBasicMaterial wireframe color="#4f7cff" transparent opacity={0.18} />
      </mesh>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.018} color="#8fb0ff" transparent opacity={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh ref={core}>
        <octahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color="#dbe6ff" metalness={0.9} roughness={0.25} envMapIntensity={1.2} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.9, 0.018, 16, 128]} />
        <meshStandardMaterial color="#a78bfa" metalness={0.95} roughness={0.2} envMapIntensity={1.4} />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 6]} intensity={2} color="#dfe8ff" />
      <directionalLight position={[-5, -2, -3]} intensity={1.2} color="#4f7cff" />
    </group>
  )
}

export default function Orb() {
  const [wrapRef, inView] = useCanvasInView()
  const pointer = useRef({ x: 0, y: 0 })
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current.x = ((e.clientX - r.left) / r.width) * 0.8 - 0.4
    pointer.current.y = ((e.clientY - r.top) / r.height) * 0.6 - 0.3
  }

  return (
    <div ref={wrapRef} className="orb-wrap" onMouseMove={onMove}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <OrbInner pointer={pointer} reduced={reduced} />
      </Canvas>
    </div>
  )
}
