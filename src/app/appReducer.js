import { combineReducers } from "redux";
import { bootReducer } from "src/core/boot";

const appReducer = combineReducers({
  boot: bootReducer
});

export default appReducer;
