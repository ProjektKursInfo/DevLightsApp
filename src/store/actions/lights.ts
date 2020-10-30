import { Light } from "../../interfaces";
import {
  EDIT_LED_COUNT, EDIT_LIGHT_COLOR, EDIT_LIGHT_NAME,
  SET_ALL_LIGHTS
} from "./types";

export function setAllLights(lights: Light[]) {
  return { type: SET_ALL_LIGHTS, lights };
}

export function setLightName(id: string, name: string) {
  return { type: EDIT_LIGHT_NAME, id, name };
}

export function setColor(id: string, colors: string[]) {
  return { type: EDIT_LIGHT_COLOR, id, colors };
}

export function setCount(id: string, count: number) {
  return { type: EDIT_LED_COUNT, id, count };
}
