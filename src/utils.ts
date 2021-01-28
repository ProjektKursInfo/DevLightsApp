import { isEqual } from "lodash";
import { Leds } from "./interfaces";
import { Gradient } from "./interfaces/store";

export const ledsEquality = (left: Leds, right: Leds): boolean => (
  isEqual(left.colors, right.colors) || isEqual(left.pattern, right.pattern));

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

export const favouriteGradientsEquality = (left: Gradient[], right: Gradient[]) : boolean => {
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
  index: number,
): string[] => {
  const newArray : string[] = [...colorArray];
  newArray[index] = new_color;
  return newArray;
};

export const isFavouriteGradient = (
  favouriteGradients: Gradient[],
  gradient: Gradient,
): boolean => {
  for (let index = 0; index < favouriteGradients.length; index++) {
    const current = favouriteGradients[index];
    if (current.start === gradient.start && current.end === gradient.end) {
      return true;
    }
  }
  return false;
};
