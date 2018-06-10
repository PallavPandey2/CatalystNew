import { LoadQuestions } from "./types";
import { ViewModels } from "../../Models/ViewModels";

export interface Question {
  questions: Array<ViewModels.Question>;
}

const initialState = {
  questions: []
};

export default function questionReducer(
  state: Question = initialState,
  action
): Question {
  switch (action.type) {
    case LoadQuestions:
      return {
        ...state,
        questions: state.questions
      };
    default:
      return state;
  }
}
