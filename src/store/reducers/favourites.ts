import { AsyncStorage } from "react-native";
import { ADD_FAVOURITE, REMOVE_FAVOURITE, SET_FAVOURITES } from "../actions/types";
import defaultstate from "../defaultstate";

function favouriteReducer(
  state = defaultstate.favourites,
  action: { type: string; [key: string]: any },
): string[] {
  let favourites;
  let favourite;
  let index;
  switch (action.type) {
    case SET_FAVOURITES:
      favourites = action.favourites;
      return favourites;
    case ADD_FAVOURITE:
      favourites = state;
      favourite = favourites.find((f) => f === action.favourite);
      if (favourite === undefined) favourites = [...favourites, action.favourite];
      AsyncStorage.setItem("favourites", JSON.stringify(favourites));
      return favourites;
    case REMOVE_FAVOURITE:
      favourites = state;
      index = favourites.findIndex((f) => f === action.favourite);
      if (index !== undefined) {
        favourites.splice(index, 1);
        AsyncStorage.setItem("favourites", JSON.stringify(favourites));
      }
      return favourites;
    default:
      return state;
  }
}
export default favouriteReducer;
