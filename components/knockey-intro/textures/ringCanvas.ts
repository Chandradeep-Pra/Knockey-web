export function renderRingCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  loading: boolean,
  time: number,
  color: string,
) {
  ctx.clearRect(0, 0, width, height);
  if (!loading) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  const head = ((time * 1.6) % 1) * width;
  const length = width * 0.35;
  ctx.fillStyle = '#05030A';
  ctx.fillRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#2D1B4E');
  gradient.addColorStop(0.5, '#6C45B8');
  gradient.addColorStop(0.85, '#8B5CFF');
  gradient.addColorStop(1, '#B47AFF');
  ctx.fillStyle = gradient;
  const start = (head - length + width) % width;
  if (start + length <= width) ctx.fillRect(start, 0, length, height);
  else {
    ctx.fillRect(start, 0, width - start, height);
    ctx.fillRect(0, 0, (start + length) % width, height);
  }
}
