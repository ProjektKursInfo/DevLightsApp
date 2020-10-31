import { CombinedState, combineReducers, createStore } from "redux";
import { Light } from "../interfaces";
import lightsReducer from "./reducers/lights";

const combinedReducers = combineReducers({ lights: lightsReducer });
export type Store = CombinedState<{ lights: Light[] }>;
const store: Store = createStore(combinedReducers);
export default store;
