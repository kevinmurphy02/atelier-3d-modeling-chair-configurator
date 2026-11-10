import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { ChairConfig } from '../lib/config';
import { bases, upholstery } from '../lib/config';

type Props = { config: ChairConfig };

function Beam({ start, end, radius, color, metalness = 0.4 }: { start: [number, number, number]; end: [number, number, number]; radius: number; color: string; metalness?: number }) {
  const { position, rotation, height } = useMemo(() => {
    const a = new THREE.Vector3(...start); const b = new THREE.Vector3(...end);
    const delta = new THREE.Vector3().subVectors(b, a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
    return { position: a.clone().add(b).multiplyScalar(0.5), rotation: new THREE.Euler().setFromQuaternion(q), height: delta.length() };
  }, [start[0], start[1], start[2], end[0], end[1], end[2]]);
  return <mesh position={position} rotation={rotation} castShadow><cylinderGeometry args={[radius, radius, height, 12]} /><meshStandardMaterial color={color} metalness={metalness} roughness={0.4} /></mesh>;
}

function Wheel({ x, z, accent }: { x: number; z: number; accent: string }) {
  return <group position={[x, 0.16, z]}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.104, 0.104, 0.095, 18]} /><meshStandardMaterial color="#24292a" roughness={0.75} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.048, 0.048, 0.101, 18]} /><meshStandardMaterial color={accent} metalness={0.7} roughness={0.25} /></mesh>
  </group>;
}

export function ChairModel({ config }: Props) {
  const fabric = upholstery[config.upholstery].hex;
  const metal = bases[config.base].hex;
  const softFabric = useMemo(() => new THREE.Color(fabric).multiplyScalar(1.13), [fabric]);
  const star = Array.from({ length: 5 }, (_, i) => i * Math.PI * 2 / 5);
  return <group position={[0, -0.17, 0]}>
    {/* Seat and frame */}
    <RoundedBox args={[1.48, 0.22, 1.29]} radius={0.1} smoothness={4} position={[0, 1.43, 0.06]} castShadow receiveShadow>
      <meshStandardMaterial color="#343b3a" roughness={0.65} />
    </RoundedBox>
    <RoundedBox args={[1.4, 0.23, 1.20]} radius={0.11} smoothness={4} position={[0, 1.55, 0.12]} castShadow receiveShadow>
      <meshStandardMaterial color={fabric} roughness={0.93} />
    </RoundedBox>
    <RoundedBox args={[1.12, 0.037, 0.83]} radius={0.018} smoothness={3} position={[0, 1.676, 0.15]} receiveShadow>
      <meshStandardMaterial color={softFabric} roughness={1} transparent opacity={0.22} />
    </RoundedBox>

    {/* Curved-looking high back, slightly reclined */}
    <group position={[0, 2.24, -0.54]} rotation={[-0.1, 0, 0]}>
      <RoundedBox args={[1.40, 1.48, 0.18]} radius={0.16} smoothness={5} castShadow receiveShadow>
        <meshStandardMaterial color={metal} metalness={0.45} roughness={0.46} />
      </RoundedBox>
      <RoundedBox args={[1.29, 1.37, 0.135]} radius={0.14} smoothness={5} position={[0, 0, 0.104]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.94} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.42, 0.025]} radius={0.05} smoothness={3} position={[0, -0.34, 0.178]}>
        <meshStandardMaterial color={softFabric} roughness={0.96} transparent opacity={0.09} />
      </RoundedBox>
      {config.headrest && <group>
        <Beam start={[-0.32, 0.66, -0.035]} end={[-0.32, 1.03, -0.035]} radius={0.035} color={metal} />
        <Beam start={[0.32, 0.66, -0.035]} end={[0.32, 1.03, -0.035]} radius={0.035} color={metal} />
        <RoundedBox args={[0.94, 0.30, 0.19]} radius={0.085} smoothness={5} position={[0, 1.085, 0.03]} castShadow>
          <meshStandardMaterial color={fabric} roughness={0.9} />
        </RoundedBox>
      </group>}
    </group>

    {/* Back brace */}
    <Beam start={[0, 1.36, -0.49]} end={[0, 1.87, -0.62]} radius={0.093} color={metal} />

    {/* Optional arms */}
    {config.arms && [-1, 1].map(side => <group key={side}>
      <Beam start={[side * 0.71, 1.33, -0.24]} end={[side * 0.75, 1.93, -0.24]} radius={0.064} color={metal} />
      <Beam start={[side * 0.70, 1.36, 0.43]} end={[side * 0.75, 1.93, 0.43]} radius={0.053} color={metal} />
      <RoundedBox args={[0.19, 0.105, 0.83]} radius={0.048} smoothness={4} position={[side * 0.75, 1.96, 0.11]} castShadow>
        <meshStandardMaterial color="#303536" roughness={0.85} />
      </RoundedBox>
    </group>)}

    {/* Gas lift + five-star base */}
    <mesh position={[0, 0.91, 0]} castShadow><cylinderGeometry args={[0.084, 0.084, 0.95, 24]} /><meshStandardMaterial color={metal} roughness={0.35} metalness={0.7} /></mesh>
    <mesh position={[0, 0.52, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.24, 24]} /><meshStandardMaterial color={metal} roughness={0.35} metalness={0.7} /></mesh>
    {star.map((angle, i) => {
      const x = Math.sin(angle) * 0.88; const z = Math.cos(angle) * 0.88;
      return <group key={i}>
        <Beam start={[0, 0.45, 0]} end={[x, 0.27, z]} radius={0.083} color={metal} metalness={0.7} />
        <Wheel x={x} z={z} accent={config.wheels ? '#c28d53' : metal} />
      </group>;
    })}
  </group>;
}
