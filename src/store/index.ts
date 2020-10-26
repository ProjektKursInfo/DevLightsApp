import { combineReducers, createStore } from "redux";
import lights from "./reducers/lights";
import defaultstate from "./defaultstate";

const combinedReducers = combineReducers({ lights });

const store = createStore(combinedReducers);
export default store;
