import { CombinedState, combineReducers, createStore } from "redux";
import { Light } from "../interfaces";
import lightsReducer from "./reducers/lights";
import favouriteReducer from "./reducers/favourites";

const combinedReducers = combineReducers({ lights: lightsReducer, favourites: favouriteReducer });
export type Store = CombinedState<{ lights: Light[] }>;
const store: Store = createStore(combinedReducers);
export default store;
