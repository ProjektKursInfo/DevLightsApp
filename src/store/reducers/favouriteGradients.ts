import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavouriteGradientsAction } from "../types/favouriteGradients";
import {
  ADD_FAVOURITE_GRADIENT,
  REMOVE_FAVOURITE_GRADIENT,
  SET_FAVOURITE_GRADIENTS
} from "../types/types";
import defaultstate from "../defaultstate";

export type Gradient = { start: string; end: string };

export default function favouriteGradientsReducer(
  state = defaultstate.favouriteGradients as Gradient[],
  action: FavouriteGradientsAction,
): Gradient[] {
  let favouriteGradients: Gradient[];
  let favourite: Gradient | undefined;
  let index: number;
  switch (action.type) {
    case SET_FAVOURITE_GRADIENTS:
      favouriteGradients = [...action.favourites];
      return favouriteGradients;
    case ADD_FAVOURITE_GRADIENT:
      favouriteGradients = [...state];
      favourite = favouriteGradients.find(
        (fav: Gradient) => fav === action.favourite,
      );
      if (favourite === undefined) {
        favouriteGradients = [
          ...favouriteGradients,
          action.favourite,
        ];
      }
      AsyncStorage.setItem("favouriteGradients", JSON.stringify(favouriteGradients));
      return favouriteGradients;
    case REMOVE_FAVOURITE_GRADIENT:
      favouriteGradients = [...state];
      index = favouriteGradients.findIndex(
        (f) => f === action.favourite,
      );
      if (index !== undefined) {
        favouriteGradients.splice(index, 1);
        AsyncStorage.setItem("favouriteGradients", JSON.stringify(favouriteGradients));
      }
      return favouriteGradients;
    default:
      return state;
  }
}
