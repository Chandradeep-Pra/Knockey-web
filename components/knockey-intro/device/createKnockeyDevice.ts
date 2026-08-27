import * as THREE from 'three';
import { createDeviceBody } from './DeviceBody';
import { createOledScreen } from './OledScreen';
import { createRingLight } from './RingLight';

export function createKnockeyDevice(
  brushedTexture: THREE.Texture,
  ringTexture: THREE.Texture,
  oledTexture: THREE.Texture,
) {
  const group = new THREE.Group();
  group.add(createDeviceBody(brushedTexture));

  const ring = createRingLight(ringTexture);
  group.add(ring.group);

  const screen = createOledScreen(oledTexture);
  group.add(screen.mesh);

  return { group, ring, screen };
}
