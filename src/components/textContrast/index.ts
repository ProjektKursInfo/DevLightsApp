export type RGB = {
  r: number,
  g: number,
  b: number
};

export function getHexNumber(number: string, double?: boolean): number {
  let worknumber = number;
  if (double) {
    worknumber += number;
  }
  return parseInt(worknumber, 16);
}
export function parseRGB(rgb: string): RGB {
  const arr: string[] = rgb.split(",");
  arr.map((c, i) => {
    arr[i] = arr[i].replace(/\D/g, "");
    return c;
  });
  return { r: parseInt(arr[0], 10), g: parseInt(arr[1], 10), b: parseInt(arr[2], 10) };
}
export function getRGBFromHex(hex: string) : RGB {
  let workHex = hex;
  let r;
  let g;
  let b;
  if (hex.length === 9) {
    workHex = hex.substring(0, 7);
  }
  if (hex.length === 4) {
    r = getHexNumber(workHex.substring(1, 2), true);
    g = getHexNumber(workHex.substring(2, 3), true);
    b = getHexNumber(workHex.substring(3, 4), true);
  } else if (hex.length === 7) {
    r = getHexNumber(workHex.substring(1, 3));
    g = getHexNumber(workHex.substring(3, 5));
    b = getHexNumber(workHex.substring(5, 7));
  } else {
    throw new Error("Invalid HEX or HEXA color code!");
  }
  return { r, g, b };
}
export function getGreyScale(rgb: RGB): number {
  return 0.3 * rgb.r + 0.59 * rgb.g + 0.11 * rgb.b;
}
export function contrastBlack(color: string): boolean {
  let scale;
  if (
    /^(rgba?)?\(([01]?\d\d?|2[0-4]\d|25[0-5]),\s*([01]?\d\d?|2[0-4]\d|25[0-5]),\s*([01]?\d\d?|2[0-4]\d|25[0-5])(?:,\s*([01]?\d\d?|2[0-4]\d|25[0-5]))?\)$/.test(
      color,
    )
  ) {
    scale = getGreyScale(parseRGB(color));
  } else if (
    /#([\d|a-f|A-F]){8}|#?([\da-fA-F]{6})|#([\d|a-f|A-F]){3}/.test(color)
  ) {
    scale = getGreyScale(getRGBFromHex(color));
  } else if (typeof color === "object") {
    scale = getGreyScale(color);
  } else {
    throw new Error("Invalid color provided");
  }
  if (scale > 127.5) {
    return true;
  }
  return false;
}
export default function getContrastTextColor(color: string): string {
  if (contrastBlack(color)) {
    return "#000";
  }
  return "#fff";
}
