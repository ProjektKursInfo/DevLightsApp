import { CombinedState, combineReducers, createStore } from "redux";
import { Light } from "../interfaces";
import lights from "./reducers/lights";

const combinedReducers = combineReducers({ lights });
export type Store = CombinedState<{ lights: Light[] }>;
const store: Store = createStore(combinedReducers);
export default store;
