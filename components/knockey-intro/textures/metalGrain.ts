import * as THREE from 'three';

export function createMetalGrainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(512, 512);

  for (let index = 0; index < image.data.length; index += 4) {
    const fine = (Math.random() - 0.5) * 18;
    const broad = Math.sin(index * 0.00017) * 3;
    const value = Math.max(0, Math.min(255, 128 + fine + broad));
    image.data[index] = value;
    image.data[index + 1] = value;
    image.data[index + 2] = value;
    image.data[index + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 3.5);
  return texture;
}
