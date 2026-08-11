import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL.js'
import { scrollState } from '../../lib/scroll'
import { useIsMobile, usePrefersReducedMotion } from '../../lib/hooks'

const EASE = 0.06

function CameraRig({ mouse, reduced, mobile }) {
  const cam = useRef(null)
  useFrame(({ camera }) => {
    const baseZ = 9.5
    const targetZ = baseZ - scrollState.progress * 13
    if (!cam.current) cam.current = camera
    camera.position.z += (targetZ - camera.position.z) * (reduced ? 1 : 0.08)
    if (reduced || mobile) {
      camera.position.x *= 0.95
      camera.position.y *= 0.95
      return
    }
    const tx = mouse.current.x * 0.7
    const ty = mouse.current.y * 0.4
    camera.position.x += (tx - camera.position.x) * EASE
    camera.position.y += (ty - camera.position.y) * EASE
    camera.lookAt(0, camera.position.y * 0.6, 0)
  })
  return null
}

function ParticleField({ count, mobile, reduced }) {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (reduced || !ref.current) return
    ref.current.rotation.y += 0.0004
    ref.current.position.z = -scrollState.progress * 5
    const t = state.clock.elapsedTime
    ref.current.position.y = Math.sin(t * 0.05) * 0.4
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={mobile ? 0.035 : 0.028}
        color="#6f8dff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function HeroSculpture({ mouse, reduced, mobile }) {
  const group = useRef(null)
  const shell = useRef(null)
  const ringA = useRef(null)
  const ringB = useRef(null)
  const core = useRef(null)
  const sats = useRef([])

  const satPositions = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => {
        const a = (i / 3) * Math.PI * 2
        const r = 3.4
        return [Math.cos(a) * r, Math.sin(i * 2.4) * 1.2, Math.sin(a) * r]
      }),
    []
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return

    if (reduced) return

    if (!mobile) {
      const tx = mouse.current.x * 0.55
      const ty = mouse.current.y * 0.35
      g.rotation.y += (tx - g.rotation.y) * EASE
      g.rotation.x += (ty - g.rotation.x) * EASE
    } else {
      g.rotation.y += delta * 0.12
    }

    const drift = scrollState.progress
    const scale = Math.max(0.001, 1 - drift * 2.4)
    g.position.y = drift * 15
    g.scale.setScalar(scale)
    g.rotation.z = drift * 0.8

    if (shell.current) {
      shell.current.rotation.y += delta * 0.16
      shell.current.rotation.x += delta * 0.05
    }
    if (ringA.current) {
      ringA.current.rotation.z += delta * 0.35
      ringA.current.rotation.x = 1.25
    }
    if (ringB.current) {
      ringB.current.rotation.z -= delta * 0.28
      ringB.current.rotation.x = 0.7
    }
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.08)
    }
    sats.current.forEach((s, i) => {
      if (!s) return
      const a = t * 0.5 + (i * Math.PI * 2) / 3
      s.position.set(Math.cos(a) * 3.1, Math.sin(a * 1.3) * 1.1, Math.sin(a) * 3.1)
      s.rotation.x += delta * 0.6
      s.rotation.y += delta * 0.8
    })
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial
          color="#cdd8ff"
          metalness={0.92}
          roughness={0.2}
          envMapIntensity={1.4}
        />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial
          color="#0a1030"
          emissive="#3b82f6"
          emissiveIntensity={reduced ? 0 : 2.4}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.35, 1]} />
        <meshBasicMaterial wireframe color="#4f7cff" transparent opacity={0.16} />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[2.75, 0.028, 16, 128]} />
        <meshStandardMaterial color="#93b4ff" metalness={1} roughness={0.15} envMapIntensity={1.6} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[2.1, 0.02, 16, 128]} />
        <meshStandardMaterial color="#a78bfa" metalness={1} roughness={0.2} envMapIntensity={1.6} />
      </mesh>
      {satPositions.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            sats.current[i] = el
          }}
          position={p}
        >
          <icosahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            color={i === 1 ? '#a78bfa' : '#dbe6ff'}
            metalness={0.95}
            roughness={0.18}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
      <pointLight color="#3b82f6" intensity={90} distance={14} decay={2} position={[0, 1, 2]} />
    </group>
  )
}

function SceneContent({ mouse, mobile, reduced, effects }) {
  return (
    <>
      <color attach="background" args={['#04060c']} />
      <fog attach="fog" args={['#04060c', 9, 26]} />
      <CameraRig mouse={mouse} reduced={reduced} mobile={mobile} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={2.2} color="#dfe8ff" />
      <directionalLight position={[-7, -3, -4]} intensity={1.1} color="#4f7cff" />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={5} color="#3b82f6" position={[0, 6, -8]} scale={[12, 12, 1]} />
        <Lightformer intensity={2.2} color="#a78bfa" position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[16, 1, 1]} />
        <Lightformer intensity={2.2} color="#c7d7ff" position={[6, 0, -2]} rotation-y={-Math.PI / 2} scale={[16, 1, 1]} />
        <Lightformer intensity={1.2} color="#1b2440" position={[0, -5, 4]} scale={[12, 12, 1]} />
      </Environment>
      <HeroSculpture mouse={mouse} reduced={reduced} mobile={mobile} />
      <Sparkles count={mobile ? 70 : 200} scale={[16, 12, 10]} size={mobile ? 2.4 : 3.2} speed={0.25} color="#8fb0ff" opacity={0.5} />
      <ParticleField count={mobile ? 400 : 1300} mobile={mobile} reduced={reduced} />
      {effects && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.85} luminanceThreshold={1} mipmapBlur luminanceSmoothing={0.15} />
        </EffectComposer>
      )}
    </>
  )
}

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 })
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const webgl = typeof window !== 'undefined' && WebGL.isWebGL2Available()

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!webgl) {
    return <div className="no-webgl" aria-hidden="true" />
  }

  return (
    <div className="scene-bg" aria-hidden="true">
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 9.5], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <SceneContent mouse={mouse} mobile={mobile} reduced={reduced} effects={!mobile && !reduced} />
      </Canvas>
    </div>
  )
}
