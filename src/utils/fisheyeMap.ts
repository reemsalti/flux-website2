export function buildFisheyeMap(size: number, curve = 0.62): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const data = ctx.createImageData(size, size);
  const center = size / 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x - center) / center;
      const ny = (y - center) / center;
      const r = Math.hypot(nx, ny);
      const idx = (y * size + x) * 4;

      if (r > 1) {
        data.data[idx] = 128;
        data.data[idx + 1] = 128;
        data.data[idx + 2] = 128;
        data.data[idx + 3] = 255;
        continue;
      }

      const theta = Math.atan2(ny, nx);
      const distortedR = Math.pow(r, curve);
      const sx = Math.cos(theta) * distortedR;
      const sy = Math.sin(theta) * distortedR;

      data.data[idx] = Math.max(0, Math.min(255, 128 + (sx - nx) * center * 0.95));
      data.data[idx + 1] = Math.max(0, Math.min(255, 128 + (sy - ny) * center * 0.95));
      data.data[idx + 2] = 128;
      data.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL('image/png');
}

export const FISHEYE_FILTER_ID = 'gallery-fisheye';
