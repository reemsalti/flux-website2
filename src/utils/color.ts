export const parseHex = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

export const lerpRgb = (
  from: string,
  to: string,
  t: number,
): [number, number, number] => {
  const [r1, g1, b1] = parseHex(from);
  const [r2, g2, b2] = parseHex(to);
  const mix = Math.min(Math.max(t, 0), 1);
  return [
    Math.round(r1 + (r2 - r1) * mix),
    Math.round(g1 + (g2 - g1) * mix),
    Math.round(b1 + (b2 - b1) * mix),
  ];
};

export const rgbString = ([r, g, b]: [number, number, number]) => `${r}, ${g}, ${b}`;
