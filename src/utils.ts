import { isEqual } from "lodash";
import { Leds, Light } from "@devlights/types";
import { Gradient } from "./store/types/favouriteGradients";

export const ledsEquality = (left: Leds, right: Leds): boolean => (
  isEqual(left.colors, right.colors) || isEqual(left.pattern, right.pattern));

export const tagArrayEquality = (l: string[], r: string[]) => {
  try {
    if (l.length !== r.length) return false;
    for (
      let i = 0;
      i < (l.length > r.length ? l.length : r.length);
      i++
    ) {
      if (l[i] !== r[i]) return false;
    }
  } catch {
    return false;
  }
  return true;
}

export const tagsEquality = (left: Light[], right: Light[], count: number, tag: string) : boolean => {
  try {
    let tagCount = 0;
    for (
      let i = 0;
      i < (left.length > right.length ? left.length : right.length);
      i++
    ) {
      if (right[i].tags?.includes(tag)) tagCount++;
      if (right[i].tags !== left[i].tags) return false;
    }

    if (tagCount !== count) return false;
  } catch {
    return false;
  }
  return true;
};

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
