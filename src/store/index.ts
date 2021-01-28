import { CombinedState, combineReducers, createStore } from "redux";
import { Light } from "../interfaces";
import lightsReducer from "./reducers/lights";
import favouriteReducer from "./reducers/favourites";
import favouriteGradientsReducer, { Gradient } from "./reducers/favouriteGradients";

const combinedReducers = combineReducers({
  lights: lightsReducer,
  favouriteColors: favouriteReducer,
  favouriteGradients: favouriteGradientsReducer,
});
export type Store = CombinedState<{
  lights: Light[];
  favouriteColors: string[];
  favouriteGradients: Gradient[];
}>;
const store: Store = createStore(combinedReducers);
export default store;
