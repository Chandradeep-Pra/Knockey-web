import * as THREE from 'three';

export type LightingRig = {
  purpleFill: THREE.PointLight;
  sideDockedWhite: THREE.PointLight;
  sideDockedPurple: THREE.PointLight;
};

export function createLightingRig(scene: THREE.Scene): LightingRig {
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(-4, 5, 6);
  scene.add(key);

  const purpleFill = new THREE.PointLight(0x8b5cff, 7.5, 18);
  purpleFill.position.set(4.5, 1.5, 2);
  scene.add(purpleFill);

  const backPurple = new THREE.PointLight(0x9d5cff, 14, 16);
  backPurple.position.set(3.2, -3, -2.2);
  scene.add(backPurple);

  const backRim = new THREE.DirectionalLight(0xb47aff, 5);
  backRim.position.set(4, -4, -3);
  scene.add(backRim);

  const sideDockedWhite = new THREE.PointLight(0xffffff, 0, 12);
  sideDockedWhite.position.set(4.2, -2.5, -2);
  scene.add(sideDockedWhite);

  const sideDockedPurple = new THREE.PointLight(0xc084fc, 0, 16);
  sideDockedPurple.position.set(4.6, -3, -2.5);
  scene.add(sideDockedPurple);

  const kicker = new THREE.PointLight(0x7a3be2, 8, 12);
  kicker.position.set(2.5, -3.2, 1.2);
  scene.add(kicker);
  scene.add(new THREE.AmbientLight(0x1a1528, 0.8));

  return { purpleFill, sideDockedWhite, sideDockedPurple };
}
