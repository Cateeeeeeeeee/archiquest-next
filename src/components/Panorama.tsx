"use client";
import { Canvas } from "@react-three/fiber";
import {
  Fisheye,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
export default function Panorama({ img }: { img: string }) {
  return (
    <Canvas>
      <Environment
        files={img}
        ground={{ height: 60, radius: 100, scale: 200 }}
      />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        makeDefault
      />
      <PerspectiveCamera makeDefault position={[45, 45, 10]} fov={100} />
    </Canvas>
  );
}

