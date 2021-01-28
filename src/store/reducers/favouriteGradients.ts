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
  let favourites: Gradient[];
  let favourite: Gradient | undefined;
  let newF : Gradient;
  let index: number;
  switch (action.type) {
    case SET_FAVOURITE_GRADIENTS:
      favourites = [...action.favourites];
      return favourites;
    case ADD_FAVOURITE_GRADIENT:
      favourites = [...state];
      newF = action.favourite;
      favourite = favourites.find(
        (fav: Gradient) => fav === newF,
      );
      if (favourite === undefined) {
        favourites = [
          ...favourites,
          newF,
        ];
      }
      AsyncStorage.setItem("favouriteGradients", JSON.stringify(favourites));
      return favourites;
    case REMOVE_FAVOURITE_GRADIENT:
      favourites = [...state];
      index = favourites.findIndex(
        (f) => f === action.favourite,
      );
      if (index !== undefined) {
        favourites.splice(index, 1);
        AsyncStorage.setItem("favouriteGradients", JSON.stringify(favourites));
      }
      return favourites;
    default:
      return state;
  }
}
