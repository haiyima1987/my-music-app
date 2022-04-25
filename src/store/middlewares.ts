import { Dispatch } from "redux";
import { IAction } from "../models/types";

/** leave it since some song names do have bad words **/
const forbiddenWords = [];

export function forbiddenWordsMiddleware({dispatch}: { dispatch: Dispatch }) {
  return function (next: Function) {
    return function (action: IAction) {
      // if (action.type === GET_TRACKS_BY_PARAMS) {
      //   const foundWords = forbiddenWords.filter(word => action.payload.title.includes(word));
      //   if (foundWords.length) {
      //     return dispatch({type: FOUND_BAD_WORD});
      //   }
      // }
      return next(action);
    }
  }
}
