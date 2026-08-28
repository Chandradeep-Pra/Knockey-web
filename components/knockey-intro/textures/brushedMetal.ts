import * as THREE from 'three';

export function createBrushedMetalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1024);
  const image = ctx.getImageData(0, 0, 1024, 1024);

  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const index = (y * 1024 + x) * 4;
      const dx = x - 512;
      const dy = y - 512;
      const angle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const value = Math.min(255, Math.max(0,
        128 + Math.sin(angle * 280) * 8 + Math.cos(distance * 0.4) * 6 + (Math.random() - 0.5) * 14,
      ));
      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = value;
      image.data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
