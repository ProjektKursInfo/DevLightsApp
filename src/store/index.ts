import { CombinedState, combineReducers, createStore } from "redux";
import { Alarm, Light } from "@devlights/types";
import lightsReducer from "./reducers/lights";
import favouritesReducer from "./reducers/favouriteColors";
import favouriteGradientsReducer, { Gradient } from "./reducers/favouriteGradients";
import { ThemeType } from "../interfaces/types";
import themeReducer from "./reducers/theme";
import tagsReducer from "./reducers/tags";
import alarmsReducer from "./reducers/alarm";

const combinedReducers = combineReducers({
  lights: lightsReducer,
  alarms: alarmsReducer,
  favouriteColors: favouritesReducer,
  favouriteGradients: favouriteGradientsReducer,
  theme: themeReducer,
  tags: tagsReducer,
});
export type Store = CombinedState<{
  lights: Light[];
  tags: string[],
  alarms: Alarm[],
  favouriteColors: string[];
  favouriteGradients: Gradient[];
  theme: ThemeType
}>;
const store: Store = createStore(combinedReducers);
export default store;
