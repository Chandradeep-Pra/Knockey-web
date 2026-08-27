import * as THREE from 'three';

export type RingLight = {
  group: THREE.Group;
  ringMesh: THREE.Mesh;
  glowRingMesh: THREE.Mesh;
  ringMaterial: THREE.MeshStandardMaterial;
  glowMaterial: THREE.MeshBasicMaterial;
  haloMaterial: THREE.MeshBasicMaterial;
};

export function createRingLight(texture: THREE.Texture): RingLight {
  const group = new THREE.Group();
  const ringMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    color: new THREE.Color('#E8D8FF'),
    emissive: new THREE.Color('#8B5CFF'),
    emissiveMap: texture,
    emissiveIntensity: 0,
    roughness: 0.12,
    metalness: 0.1,
  });
  const ringMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1.76, 0.052, 32, 128),
    ringMaterial,
  );
  ringMesh.position.z = 0.4;
  group.add(ringMesh);

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#B47AFF'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const glowRingMesh = new THREE.Mesh(
    new THREE.RingGeometry(1.68, 1.86, 128),
    glowMaterial,
  );
  glowRingMesh.position.z = 0.408;
  group.add(glowRingMesh);

  const haloMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#6C63FF'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(1.72, 1.94, 128),
    haloMaterial,
  );
  halo.position.z = 0.406;
  group.add(halo);

  return { group, ringMesh, glowRingMesh, ringMaterial, glowMaterial, haloMaterial };
}
