import { combineReducers } from "redux";
import counter, { Counter } from "./counter/reducer";
import questions, { Question } from "./Questions/reducer";
import { Dispatch as ReduxDispatch } from "redux";
import { ViewModels } from "../Models/ViewModels";

export interface AppState {
  questions: Array<ViewModels.Question>;
}

export type Dispatch = ReduxDispatch<AppState>;

// Add more
const appReducer = combineReducers<AppState>({
  questions
});

// Setup root reducer
const rootReducer = (state, action) => {
  const newState = action.type === "RESET" ? undefined : state;
  return appReducer(newState, action);
};

export default rootReducer;
