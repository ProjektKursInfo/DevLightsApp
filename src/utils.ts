import { isEqual } from "lodash";
import { Leds } from "./interfaces";

export const ledsEquality = (left: Leds, right: Leds): boolean =>
  isEqual(left.colors, right.colors) || isEqual(left.pattern, right.pattern);

export const favouritesEquality = (
  left: string[],
  right: string[],
): boolean => {
  try {
    for (
      let i = 0;
      i < (left.length > right.length ? left.length : right.length);
      i++
    ) {
      if (right[i] !== left[i]) return false;
    }
  } catch {
    return false;
  }
  return true;
};

export const makeValidColorArray = (
  new_color: string,
  colorArray: string[],
  index: number
): string[] => {
  colorArray[index] = new_color;
  return colorArray;
};
