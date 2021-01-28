import {
  AddFavouriteColorAction,
  AddFavouriteGradientAction,
  RemoveFavouriteColorAction,
  RemoveFavouriteGradientAction,
  SetFavouriteColorsAction,
  SetFavouriteGradientsAction,
  Gradient
} from "../../interfaces/store";

export function setFavouriteColors(
  favourites: string[],
): SetFavouriteColorsAction {
  return { type: "SET_FAVOURITE_COLORS", favourites };
}

export function addFavouriteColor(favourite: string): AddFavouriteColorAction {
  return { type: "ADD_FAVOURITE_COLOR", favourite };
}

export function removeFavouriteColor(
  favourite: string,
): RemoveFavouriteColorAction {
  return { type: "REMOVE_FAVOURITE_COLOR", favourite };
}

export function setFavouriteGradients(
  favourites: Gradient[],
): SetFavouriteGradientsAction {
  return { type: "SET_FAVOURITE_GRADIENTS", favourites };
}

export function addFavouriteGradient(
  favourite: Gradient,
): AddFavouriteGradientAction {
  return { type: "ADD_FAVOURITE_GRADIENT", favourite };
}

export function removeFavouriteGradient(
  favourite: Gradient,
): RemoveFavouriteGradientAction {
  return { type: "REMOVE_FAVOURITE_GRADIENT", favourite };
}
