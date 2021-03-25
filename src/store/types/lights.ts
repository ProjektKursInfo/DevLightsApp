import { Light, Pattern } from "@devlights/types";
import {
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,
  SET_ALL_LIGHTS,
  SET_BRIGHTNESS,
  SET_LIGHT,
  SET_LIGHT_STATUS,
} from "./types";

export interface SetLightsAction {
  type: typeof SET_ALL_LIGHTS;
  lights: Light[];
}

export interface SetLightAction {
  type: typeof SET_LIGHT;
  id: string;
  light: Light;
}

export interface SetLightStatusAction {
  type: typeof SET_LIGHT_STATUS;
  id: string;
  isOn: boolean;
}

export interface EditLightNameAction {
  type: typeof EDIT_LIGHT_NAME;
  id: string;
  name: string;
}

export interface SetLightBrightnessAction {
  type: typeof SET_BRIGHTNESS;
  id: string;
  brightness: number;
}

export interface EditLedCountAction {
  type: typeof EDIT_LED_COUNT;
  id: string;
  count: number;
}

export interface SetLightColorAction {
  type: typeof EDIT_LIGHT_COLOR;
  id: string;
  pattern: Pattern;
  colors: string[];
  timeout?: number;
}

export type LightActionTypes =
  | SetLightsAction
  | SetLightAction
  | SetLightStatusAction
  | SetLightBrightnessAction
  | SetLightColorAction
  | EditLedCountAction
  | EditLightNameAction;
