import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RotateCcw } from 'lucide-react';
import type { ChairConfig } from '../lib/config';
import { ChairModel } from './ChairModel';

export function ChairCanvas({ config }: { config: ChairConfig }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  return <div className="viewer" aria-label="Interactive 3D chair preview">
    <div className="viewer-top"><span className="viewer-index">FIG. 01 / INTERACTIVE MODEL</span><span className="live-dot"><i /> LIVE PREVIEW</span></div>
    <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true }}>
      <color attach="background" args={['#edebe5']} />
      <PerspectiveCamera makeDefault position={[4.7, 3.3, 5.2]} fov={36} />
      <ambientLight intensity={1.35} />
      <hemisphereLight args={['#ffffff', '#b1a99e', 1.2]} />
      <directionalLight position={[-4, 8, 5]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.00015} />
      <directionalLight position={[5, 3, -4]} intensity={1.25} />
      <Suspense fallback={null}>
        <ChairModel config={config} />
        <ContactShadows position={[0, -0.06, 0]} opacity={0.26} scale={8} blur={2.5} far={4} resolution={256} color="#4d504b" />
      </Suspense>
      <OrbitControls ref={controls} target={[0, 1.33, 0]} enablePan={false} minDistance={3.3} maxDistance={9} minPolarAngle={0.3} maxPolarAngle={Math.PI / 2.05} autoRotate={autoRotate} autoRotateSpeed={1.1} />
    </Canvas>
    <div className="viewer-bottom">
      <span>DRAG TO ROTATE <span className="dot-sep">·</span> SCROLL TO ZOOM</span>
      <div className="viewer-actions">
        <button type="button" className={autoRotate ? 'viewer-button active' : 'viewer-button'} onClick={() => setAutoRotate(v => !v)} aria-pressed={autoRotate}>{autoRotate ? 'STOP SPIN' : 'AUTO ROTATE'}</button>
        <button type="button" className="viewer-button viewer-reset" title="Reset view" aria-label="Reset camera view" onClick={() => { controls.current?.reset(); setAutoRotate(false); }}><RotateCcw size={15} /></button>
      </div>
    </div>
  </div>;
}
