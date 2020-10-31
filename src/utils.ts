import { isEqual } from "lodash";
import { Leds } from "./interfaces";

// eslint-disable-next-line import/prefer-default-export
export const ledsEquality = (left: Leds, right: Leds): boolean => (
  isEqual(left.colors, right.colors) || isEqual(left.pattern, right.pattern)
);
