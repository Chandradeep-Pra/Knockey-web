import * as THREE from 'three';

type DeviceLayoutInput = {
  width: number;
  introScale: number;
  dockProgress: number;
  finalProgress: number;
};

export function getDeviceLayout({ width, introScale, dockProgress, finalProgress }: DeviceLayoutInput) {
  const isPhone = width <= 640;
  const scaleMultiplier = isPhone ? 0.64 : 1 - 0.15 * dockProgress;
  const storyScale = introScale * scaleMultiplier;
  const scale = THREE.MathUtils.lerp(storyScale, isPhone ? 0.187 : 0.42, finalProgress);
  const storyX = (isPhone ? 0.62 : 2.45) * dockProgress;
  const initialPhoneY = 0.6;
  const targetY = isPhone ? -0.8 : 0;
  const storyY = isPhone ? THREE.MathUtils.lerp(initialPhoneY, targetY, dockProgress) : 0;

  return {
    isPhone,
    scale,
    x: THREE.MathUtils.lerp(storyX, isPhone ? -0.95 : -1.35, finalProgress),
    y: THREE.MathUtils.lerp(storyY, isPhone ? 0.3 : 0, finalProgress),
  };
}
