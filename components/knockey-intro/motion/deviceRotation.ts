import * as THREE from 'three';

type RotationInput = {
  dockProgress: number;
  finalProgress: number;
  pointer: { x: number; y: number };
  elapsedTime: number;
};

export function getDeviceRotation({ dockProgress, finalProgress, pointer, elapsedTime }: RotationInput) {
  const pointerWeight = Math.max(0, 1 - dockProgress);
  const pointerY = pointer.x * 0.52 * pointerWeight;
  const pointerX = -pointer.y * 0.35 * pointerWeight;

  return {
    pointerWeight,
    x: pointerX + Math.cos(elapsedTime * 0.6) * 0.01,
    y: THREE.MathUtils.lerp(-0.82 * dockProgress, 0.56, finalProgress)
      + pointerY
      + Math.sin(elapsedTime * 0.8) * 0.016,
    z: 0.04 * dockProgress,
  };
}

export function easeDeviceRotation(group: THREE.Group, target: { x: number; y: number; z: number }) {
  group.rotation.x += (target.x - group.rotation.x) * 0.07;
  group.rotation.y += (target.y - group.rotation.y) * 0.07;
  group.rotation.z += (target.z - group.rotation.z) * 0.07;
}
