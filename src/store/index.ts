import { CombinedState, combineReducers, createStore } from "redux";
import { Light } from "../interfaces";
import lightsReducer from "./reducers/lights";
import favouriteReducer from "./reducers/favouriteColors";
import favouriteGradientsReducer, { Gradient } from "./reducers/favouriteGradients";
import { ThemeType } from "../interfaces/types";
import themeReducer from "./reducers/theme";
import tagsReducer from "./reducers/tags";

const combinedReducers = combineReducers({
  lights: lightsReducer,
  favouriteColors: favouriteReducer,
  favouriteGradients: favouriteGradientsReducer,
  theme: themeReducer,
  tags: tagsReducer,
});
export type Store = CombinedState<{
  lights: Light[];
  tags: string[],
  favouriteColors: string[];
  favouriteGradients: Gradient[];
  theme: ThemeType
}>;
const store: Store = createStore(combinedReducers);
export default store;
