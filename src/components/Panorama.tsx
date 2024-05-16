"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import SelectImageRegion from './SelectImageRegion';

type PanoramaProps = {
  images: string[];
  onTreasureFound: (selectedRegion: string) => void;
};

export default function Panorama({ images, onTreasureFound }: PanoramaProps) {
  const handleRegionSelected = (selectedRegion: string) => {
    onTreasureFound(selectedRegion);
  };

  const loadCubeTexture = (images: string[]) => {
    if (!images || images.length === 0) {
      // Return a default cube texture or handle the case when images are not available
      return null;
    }
    const loader = new CubeTextureLoader();
    return loader.load(images);
  };

  return (
    <div className="relative w-full h-[400px]">
      <Canvas>
        {images && images.length > 0 && (
          <>
            <Environment map={loadCubeTexture(images)} background />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
            <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={75} />
          </>
        )}
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full">
        <SelectImageRegion onSelect={handleRegionSelected} />
      </div>
    </div>
  );
}