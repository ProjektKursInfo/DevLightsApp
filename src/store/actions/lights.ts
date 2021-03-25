import {
  EditLedCountAction,
  EditLightNameAction,
  SetLightAction,
  SetLightBrightnessAction,
  SetLightColorAction,
  SetLightsAction,
  SetLightStatusAction,
} from "../types/lights";
import { Light, Pattern } from "@devlights/types";
import {
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,
  SET_ALL_LIGHTS,
  SET_BRIGHTNESS,
} from "../types/types";

export function setAllLights(lights: Light[]): SetLightsAction {
  return { type: SET_ALL_LIGHTS, lights };
}

export function setLight(id: string, light: Light): SetLightAction {
  return { type: "SET_LIGHT", id, light };
}

export function setLightStatus(
  id: string,
  isOn: boolean,
): SetLightStatusAction {
  return { type: "SET_LIGHT_STATUS", id, isOn };
}

export function editLightName(id: string, name: string): EditLightNameAction {
  return { type: EDIT_LIGHT_NAME, id, name };
}

export function setLedCount(id: string, count: number): EditLedCountAction {
  return { type: EDIT_LED_COUNT, id, count };
}

export function setLightColor(
  id: string,
  pattern: Pattern,
  colors: string[],
  timeout?: number,
): SetLightColorAction {
  return { type: EDIT_LIGHT_COLOR, id, pattern, colors, timeout };
}

export function setLightBrightness(
  id: string,
  brightness: number,
): SetLightBrightnessAction {
  return { type: SET_BRIGHTNESS, id, brightness };
}
