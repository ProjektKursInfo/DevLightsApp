import {
  ADD_FAVOURITE_GRADIENT,
  REMOVE_FAVOURITE_GRADIENT,
  SET_FAVOURITE_GRADIENTS
} from "./types";

export type Gradient = { start: string; end: string };

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

export type FavouriteGradientsAction =
  | SetFavouriteGradientsAction
  | AddFavouriteGradientAction
  | RemoveFavouriteGradientAction;
