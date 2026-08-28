import * as THREE from 'three';
import { createMetalGrainTexture } from '../textures/metalGrain';

export function createQrMetalCard() {
  const group = new THREE.Group();
  const grain = createMetalGrainTexture();
  const shape = roundedCardShape(2.75, 3.7, 0.22);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.055,
    bevelThickness: 0.045,
    curveSegments: 24,
  });
  geometry.center();

  const metal = new THREE.MeshPhysicalMaterial({
    color: '#6C45B8',
    metalness: 0.85,
    roughness: 0.49,
    clearcoat: 0.05,
    clearcoatRoughness: 0.55,
    bumpMap: grain,
    bumpScale: 0.012,
    roughnessMap: grain,
    reflectivity: 0.72,
  });
  const plate = new THREE.Mesh(geometry, metal);
  group.add(plate);

  const faceTexture = createCardFaceTexture();
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(2.38, 3.28),
    new THREE.MeshPhysicalMaterial({
      map: faceTexture,
      transparent: true,
      roughness: 0.38,
      clearcoat: 0.04,
    }),
  );
  face.position.z = 0.145;
  group.add(face);

  return { group, materials: [metal, face.material] };
}

function roundedCardShape(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function createCardFaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1240;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 900, 1240);

  drawWhiteQr(ctx, 210, 145, 480);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#F0EAF4';
  ctx.font = '500 62px Manrope, sans-serif';
  ctx.fillText("Rishi's house", 450, 845);
  ctx.fillStyle = 'rgba(240,234,244,.62)';
  ctx.font = '500 30px Manrope, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('SCAN TO CONNECT', 450, 930);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

function drawWhiteQr(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const count = 25;
  const cell = size / count;
  ctx.fillStyle = '#F7F4F8';
  for (let row = 0; row < count; row++) {
    for (let column = 0; column < count; column++) {
      const finder = (column < 7 && row < 7) || (column > 17 && row < 7) || (column < 7 && row > 17);
      if (finder) continue;
      if ((column * 19 + row * 23 + column * row * 3) % 9 > 4) continue;
      ctx.fillRect(x + column * cell + 1.5, y + row * cell + 1.5, cell - 3, cell - 3);
    }
  }
  drawFinder(ctx, x, y, cell);
  drawFinder(ctx, x + cell * 18, y, cell);
  drawFinder(ctx, x, y + cell * 18, cell);
}

function drawFinder(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number) {
  ctx.fillStyle = '#F7F4F8';
  ctx.fillRect(x, y, cell * 7, cell);
  ctx.fillRect(x, y + cell * 6, cell * 7, cell);
  ctx.fillRect(x, y + cell, cell, cell * 5);
  ctx.fillRect(x + cell * 6, y + cell, cell, cell * 5);
  ctx.fillRect(x + cell * 2, y + cell * 2, cell * 3, cell * 3);
}
