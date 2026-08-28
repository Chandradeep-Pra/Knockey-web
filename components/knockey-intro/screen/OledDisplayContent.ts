const OLED_BLACK = '#000000';
const KNOCKEY_DARK_PURPLE = '#6C45B8';

export function renderOledDisplay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  reveal: number,
  fontFamily = 'Manrope, sans-serif',
  stage?: StoryStage,
) {
  ctx.fillStyle = OLED_BLACK;
  ctx.fillRect(0, 0, width, height);

  if (reveal <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = reveal;

  const reflection = ctx.createLinearGradient(1200, 200, 1950, 1200);
  reflection.addColorStop(0, 'rgba(255, 255, 255, 0.13)');
  reflection.addColorStop(0.3, 'rgba(255, 255, 255, 0.045)');
  reflection.addColorStop(0.6, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = reflection;
  ctx.beginPath();
  ctx.moveTo(1100, 120);
  ctx.quadraticCurveTo(1850, 400, 1900, 1450);
  ctx.lineTo(1980, 950);
  ctx.quadraticCurveTo(1850, 250, 1400, 120);
  ctx.closePath();
  ctx.fill();

  renderStageContent(ctx, fontFamily, time, reveal, stage);
  ctx.restore();
}

function renderStageContent(
  ctx: CanvasRenderingContext2D,
  fontFamily: string,
  time: number,
  reveal: number,
  stage?: StoryStage,
) {
  const mode = stage?.oledMode ?? 'hello';
  const color = stage?.ringColor ?? KNOCKEY_DARK_PURPLE;

  if (mode === 'hello') {
    renderGreeting(ctx, fontFamily);
    renderWaveform(ctx, time, reveal, KNOCKEY_DARK_PURPLE);
    return;
  }
  if (mode === 'listening') {
    renderListening(ctx, fontFamily, time, reveal, color);
    return;
  }
  if (mode === 'understanding') {
    renderInfoCard(ctx, fontFamily, ['Rahul', 'DELIVERY', 'Amazon', 'Expected today'], color);
    return;
  }
  if (mode === 'memory') {
    renderInfoCard(ctx, fontFamily, ['Rahul', 'Seen before', '3 deliveries', 'Usually leaves packages at the door.'], color);
    return;
  }
  if (mode === 'expected') {
    renderInfoCard(ctx, fontFamily, ['TODAY', 'Amazon delivery expected', '↓', 'Rahul is at your door', '✓ Matched'], color);
    return;
  }
  if (mode === 'notifying') {
    renderCenteredLines(ctx, fontFamily, ['Getting you…', '➤'], color);
    return;
  }
  if (mode === 'control') {
    renderCenteredLines(ctx, fontFamily, ['What should I', 'tell Rahul?', '•••'], color);
    return;
  }
  if (mode === 'responding') {
    renderCenteredLines(ctx, fontFamily, ['Please leave the', 'package at the door.', 'Thank you!'], color);
    renderWaveform(ctx, time, reveal, color, 1375);
    return;
  }
  if (mode === 'qr') {
    renderQr(ctx);
    return;
  }
  renderReady(ctx, fontFamily);
}

function renderQr(ctx: CanvasRenderingContext2D) {
  const moduleCount = 29;
  const cell = 24;
  const size = moduleCount * cell;
  const startX = 1024 - size / 2;
  const startY = 1024 - size / 2;

  const isFinderArea = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= moduleCount - 8 && y < 8) || (x < 8 && y >= moduleCount - 8);

  ctx.fillStyle = '#F5F2F7';
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (isFinderArea(x, y)) continue;
      const seeded = (x * 17 + y * 31 + x * y * 7) % 11;
      if (seeded > 5) continue;
      ctx.beginPath();
      ctx.roundRect(startX + x * cell + 2, startY + y * cell + 2, cell - 4, cell - 4, 4);
      ctx.fill();
    }
  }

  drawFinder(ctx, startX, startY, cell);
  drawFinder(ctx, startX + (moduleCount - 7) * cell, startY, cell);
  drawFinder(ctx, startX, startY + (moduleCount - 7) * cell, cell);
}

function drawFinder(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number) {
  ctx.fillStyle = '#F5F2F7';
  // White finder border; the OLED black remains untouched in the gap.
  ctx.fillRect(x, y, cell * 7, cell);
  ctx.fillRect(x, y + cell * 6, cell * 7, cell);
  ctx.fillRect(x, y + cell, cell, cell * 5);
  ctx.fillRect(x + cell * 6, y + cell, cell, cell * 5);
  ctx.beginPath();
  ctx.roundRect(x + cell * 2, y + cell * 2, cell * 3, cell * 3, 7);
  ctx.fill();
}

function renderReady(ctx: CanvasRenderingContext2D, fontFamily: string) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `400 132px ${fontFamily}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Ready.', 1024, 1024);
}

function renderListening(
  ctx: CanvasRenderingContext2D,
  fontFamily: string,
  time: number,
  reveal: number,
  color: string,
) {
  // Clean outlined ear icon, drawn directly for consistent OLED rendering.
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(965, 735);
  ctx.bezierCurveTo(960, 650, 1010, 605, 1070, 620);
  ctx.bezierCurveTo(1135, 637, 1154, 710, 1122, 765);
  ctx.bezierCurveTo(1106, 792, 1080, 806, 1065, 842);
  ctx.bezierCurveTo(1050, 878, 1014, 890, 986, 868);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1003, 733);
  ctx.bezierCurveTo(1003, 691, 1030, 670, 1060, 680);
  ctx.bezierCurveTo(1090, 691, 1094, 728, 1074, 751);
  ctx.bezierCurveTo(1056, 772, 1035, 777, 1028, 806);
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `500 82px ${fontFamily}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Listening…', 1024, 1010);

  renderWaveform(ctx, time, reveal, color, 1245);
}

function renderCenteredLines(
  ctx: CanvasRenderingContext2D,
  fontFamily: string,
  lines: string[],
  color: string,
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, index) => {
    ctx.font = `${index === 0 ? 500 : 400} ${index === 0 ? 108 : 72}px ${fontFamily}`;
    ctx.fillStyle = index === lines.length - 1 && lines.length > 1 ? color : '#FFFFFF';
    ctx.fillText(line, 1024, 850 + index * 130);
  });
}

function renderInfoCard(
  ctx: CanvasRenderingContext2D,
  fontFamily: string,
  lines: string[],
  color: string,
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, index) => {
    ctx.font = `${index === 0 ? 500 : 400} ${index === 0 ? 108 : 66}px ${fontFamily}`;
    ctx.fillStyle = index === 1 ? color : '#FFFFFF';
    ctx.fillText(line, 1024, 760 + index * 125);
  });
}

function renderGreeting(ctx: CanvasRenderingContext2D, fontFamily: string) {
  const prefix = 'Hi, I am Knock';
  const accent = 'e';
  const suffix = 'y';
  const y = 965;

  ctx.textBaseline = 'middle';
  ctx.font = `500 116px ${fontFamily}`;
  const width = ctx.measureText(`${prefix}${accent}${suffix}`).width;
  const startX = 1024 - width / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(prefix, startX, y);

  const accentX = startX + ctx.measureText(prefix).width;
  ctx.fillStyle = KNOCKEY_DARK_PURPLE;
  ctx.fillText(accent, accentX, y);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(suffix, accentX + ctx.measureText(accent).width, y);
}

function renderWaveform(
  ctx: CanvasRenderingContext2D,
  time: number,
  reveal: number,
  color = KNOCKEY_DARK_PURPLE,
  centerY = 1215,
) {
  const barCount = 13;
  const barWidth = 18;
  const barSpacing = 24;
  const startX = 1024 - (barCount * (barWidth + barSpacing)) / 2;

  ctx.fillStyle = color;
  for (let index = 0; index < barCount; index++) {
    const distance = Math.abs(index - (barCount - 1) / 2) / (barCount / 2);
    const envelope = Math.max(0.15, 1 - Math.pow(distance, 1.5));
    const wave1 = Math.sin(time * 4.2 + index * 0.38);
    const wave2 = Math.cos(time * 2.8 - index * 0.24);
    const wave3 = Math.sin(time * 6.5 + index * 0.8) * 0.45;
    const amplitude = (wave1 * 0.5 + wave2 * 0.35 + wave3 + 1.2) * 0.5;
    const height = Math.max(18, amplitude * 180 * envelope * reveal);
    const x = startX + index * (barWidth + barSpacing);

    ctx.beginPath();
    ctx.roundRect(x, centerY - height / 2, barWidth, height, barWidth / 2);
    ctx.fill();
  }
}
import type { StoryStage } from '../story/storyStages';
