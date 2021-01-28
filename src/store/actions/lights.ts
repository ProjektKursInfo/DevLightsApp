import { Light } from "../../interfaces";
import {
  EditLedCountAction,
  EditLightNameAction,
  SetLightAction,
  SetLightBrightnessAction,
  SetLightColorAction,
  SetLightsAction
} from "../../interfaces/store";
import { Pattern } from "../../interfaces/types";
import {
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,
  SET_ALL_LIGHTS,
  SET_BRIGHTNESS
} from "./types";

export function setAllLights(lights: Light[]): SetLightsAction {
  return { type: SET_ALL_LIGHTS, lights };
}

export function setLight(id: string, light: Light): SetLightAction {
  return {type: "SET_LIGHT", id, light};
}

export function editLightName(id: string, name: string): EditLightNameAction {
  return { type: EDIT_LIGHT_NAME, id, name };
}

export function setCount(id: string, count: number): EditLedCountAction {
  return { type: EDIT_LED_COUNT, id, count };
}

export function setColor(
  id: string,
  pattern: Pattern,
  colors: string[],
): SetLightColorAction {
  return { type: EDIT_LIGHT_COLOR, id, pattern, colors };
}

export function setBrightness(
  id: string,
  brightness: number,
): SetLightBrightnessAction {
  return { type: SET_BRIGHTNESS, id, brightness };
}
