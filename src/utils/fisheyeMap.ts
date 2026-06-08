export function buildFisheyeMap(
  size: number,
  centerCurve = 0.58,
  edgeStart = 0.42,
  edgeCurve = 1.16,
): string {
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
      const edgeT = r <= edgeStart ? 0 : (r - edgeStart) / (1 - edgeStart);
      const curve = centerCurve + edgeT * edgeT * (edgeCurve - centerCurve);
      const distortedR = r ** curve;
      const sx = Math.cos(theta) * distortedR;
      const sy = Math.sin(theta) * distortedR;

      const edgeMul =
        r <= edgeStart ? 1 : Math.max(0.04, 1 - edgeT ** 1.25);
      const centerBoost = 1 + (1 - r) * 0.12;
      const strength = 0.96 * edgeMul * centerBoost;

      data.data[idx] = Math.max(0, Math.min(255, 128 + (sx - nx) * center * strength));
      data.data[idx + 1] = Math.max(0, Math.min(255, 128 + (sy - ny) * center * strength));
      data.data[idx + 2] = 128;
      data.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL('image/png');
}

export const FISHEYE_FILTER_ID = 'gallery-fisheye';
