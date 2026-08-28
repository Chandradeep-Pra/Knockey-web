import * as THREE from 'three';

export function getCameraDistance(width: number) {
  if (width <= 430) return 9.6;
  if (width <= 768) return 8.8;
  if (width <= 1024) return 8;
  if (width <= 1440) return 7.5;
  return 7.2;
}

export function createSceneCamera(width: number, height: number) {
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0, getCameraDistance(width));
  camera.lookAt(0, 0, 0);
  return camera;
}

export function resizeSceneCamera(
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
) {
  camera.aspect = width / height;
  camera.position.z = getCameraDistance(width);
  camera.updateProjectionMatrix();
}
