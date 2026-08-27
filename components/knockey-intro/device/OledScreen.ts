import * as THREE from 'three';

export function createOledScreen(texture: THREE.Texture) {
  const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: new THREE.Color('#FFFFFF'),
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    reflectivity: 0.8,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(1.73, 128), material);
  mesh.position.z = 0.402;
  return { mesh, material };
}
