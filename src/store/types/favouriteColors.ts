import {
  ADD_FAVOURITE_COLOR,
  REMOVE_FAVOURITE_COLOR,
  SET_FAVOURITE_COLORS
} from "./types";

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

export type FavouriteColorsAction =
  | SetFavouriteColorsAction
  | AddFavouriteColorAction
  | RemoveFavouriteColorAction;
