import * as THREE from 'three';

export function createDeviceBody(brushedTexture: THREE.Texture) {
  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#6C45B8'),
    metalness: 0.74,
    roughness: 0.38,
    clearcoat: 0.15,
    clearcoatRoughness: 0.4,
    bumpMap: brushedTexture,
    bumpScale: 0.015,
    reflectivity: 0.85,
  });
  const bezelMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#161026'),
    metalness: 0.85,
    roughness: 0.32,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
  });

  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(2.1, 2.18, 0.75, 128, 1, false),
    bodyMaterial,
  );
  shell.rotation.x = Math.PI / 2;
  group.add(shell);

  const frontChamfer = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.08, 32, 128),
    bodyMaterial,
  );
  frontChamfer.position.z = 0.375;
  group.add(frontChamfer);

  const innerWall = new THREE.Mesh(
    new THREE.CylinderGeometry(1.82, 1.95, 0.15, 128, 1, true),
    bezelMaterial,
  );
  innerWall.rotation.x = Math.PI / 2;
  innerWall.position.z = 0.35;
  group.add(innerWall);

  const statusLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.016, 20, 20),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22C55E'),
      roughness: 0.4,
      metalness: 0.1,
    }),
  );
  statusLed.position.set(2.135, 0, 0);
  group.add(statusLed);

  return group;
}
