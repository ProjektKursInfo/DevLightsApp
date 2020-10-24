export function getHexNumber(number: string, double?: boolean) {
  if (double) {
    number += number;
  }
  return parseInt(number, 16);
}
export function parseRGB(rgb: string) {
  let arr: string[]= rgb.split(",");
  
  arr.map((c, i) => {
    arr[i] = arr[i].replace(/\D/g, "");
  });
  return { r: arr[0], g: arr[1], b: arr[2] };
}
export function getRGBFromHex(hex: string) {
  let r, g, b;
  if (hex.length == 9) {
    hex = hex.substring(0, 7);
  }
  if (hex.length == 4) {
    r = getHexNumber(hex.substring(1, 2), true);
    g = getHexNumber(hex.substring(2, 3), true);
    b = getHexNumber(hex.substring(3, 4), true);
  } else if (hex.length == 7) {
    r = getHexNumber(hex.substring(1, 3));
    g = getHexNumber(hex.substring(3, 5));
    b = getHexNumber(hex.substring(5, 7));
  } else {
    throw "Invalid HEX or HEXA color code!";
  }
  return { r, g, b };
}
export function getGreyScale(rgb) {
  return 0.3 * rgb.r + 0.59 * rgb.g + 0.11 * rgb.b;
}
export function contrastBlack(color: string) {
  let scale;
  if (
    /^(rgba?)?\(([01]?\d\d?|2[0-4]\d|25[0-5]),\s*([01]?\d\d?|2[0-4]\d|25[0-5]),\s*([01]?\d\d?|2[0-4]\d|25[0-5])(?:,\s*([01]?\d\d?|2[0-4]\d|25[0-5]))?\)$/.test(
      color
    )
  ) {
    scale = getGreyScale(parseRGB(color));
  } else if (
    /#([\d|a-f|A-F]){8}|#?([\da-fA-F]{6})|#([\d|a-f|A-F]){3}/.test(color)
  ) {
    scale = getGreyScale(getRGBFromHex(color));
  } else if (typeof color == "object") {
    scale = getGreyScale(color);
  } else {
    throw "Invalid color provided";
  }
  if (scale > 127.5) {
    return true;
  } else {
    return false;
  }
}
export default function getContrastTextColor(color) {
  if (contrastBlack(color)) {
    return "#000";
  } else {
    return "#fff";
  }
}
