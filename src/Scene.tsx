import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
function Sculpture() {
  const ref = useRef<Group>(null);
  useFrame(({ clock, pointer }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.09 + pointer.x * 0.18;
      ref.current.rotation.x = 0.25 + pointer.y * 0.12;
    }
  });
  return (
    <group ref={ref} rotation={[0.25, 0, -0.5]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[i * 0.36, i * 0.5, i * 0.22]}>
          <torusGeometry args={[1.65 - i * 0.12, 0.065, 12, 100]} />
          <meshStandardMaterial
            color={i % 2 ? '#9487db' : '#a4efea'}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.67, 1]} />
        <meshStandardMaterial
          color="#8275d6"
          metalness={0.75}
          roughness={0.26}
        />
      </mesh>
    </group>
  );
}
export default function Scene() {
  const [active, setActive] = useState(true);
  const holder = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (holder.current) observer.observe(holder.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return (
    <div ref={holder} className="scene">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 0, 5.8], fov: 43 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => {
            gl.domElement.style.display = 'none';
          });
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={4} />
        <pointLight position={[-3, -2, 2]} color="#9d84ff" intensity={25} />
        <Sculpture />
      </Canvas>
    </div>
  );
}
