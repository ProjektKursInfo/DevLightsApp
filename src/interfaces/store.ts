import { Light } from ".";
import {
  ADD_FAVOURITE_COLOR,
  ADD_FAVOURITE_GRADIENT,
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,
  REMOVE_FAVOURITE_COLOR,
  REMOVE_FAVOURITE_GRADIENT,
  SET_ALL_LIGHTS,
  SET_BRIGHTNESS,
  SET_FAVOURITE_COLORS,
  SET_FAVOURITE_GRADIENTS,
  SET_LIGHT,
  SET_LIGHT_STATUS
} from "../store/actions/types";
import { Pattern } from "./types";

export type Gradient = {start: string, end: string};

export interface SetLightsAction {
  type: typeof SET_ALL_LIGHTS;
  lights: Light[];
}

export interface SetLightAction {
  type: typeof SET_LIGHT;
  id: string;
  light: Light;
}

export interface SetLightStatus {
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
}

export interface SetFavouriteColorsAction {
  type: typeof SET_FAVOURITE_COLORS;
  favourites: string[];
}

export interface AddFavouriteColorAction {
  type: typeof ADD_FAVOURITE_COLOR;
  favourite: string;
}

export interface RemoveFavouriteColorAction {
  type: typeof REMOVE_FAVOURITE_COLOR;
  favourite: string;
}

export interface SetFavouriteGradientsAction {
  type: typeof SET_FAVOURITE_GRADIENTS;
  favourites: Gradient[];
}

export interface AddFavouriteGradientAction {
  type: typeof ADD_FAVOURITE_GRADIENT;
  favourite: Gradient;
}

export interface RemoveFavouriteGradientAction {
  type: typeof REMOVE_FAVOURITE_GRADIENT;
  favourite: Gradient;
}

export type LightActionTypes =
  | SetLightsAction
  | SetLightAction
  | SetLightStatus
  | SetLightBrightnessAction
  | SetLightColorAction
  | EditLedCountAction
  | EditLightNameAction;

export type FavouriteColorsAction =
  | SetFavouriteColorsAction
  | AddFavouriteColorAction
  | RemoveFavouriteColorAction;

export type FavouriteGradientsAction =
  | SetFavouriteGradientsAction
  | AddFavouriteGradientAction
  | RemoveFavouriteGradientAction;
