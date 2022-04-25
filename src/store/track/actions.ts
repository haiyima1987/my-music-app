import apiHandler from "../../utils/ApiHandler";
import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";

export const FOUND_BAD_WORD = "track/foundBadWord";
export const GET_TRACKS_BY_PARAMS = "track/getTracksByParams";

export function getTracksByParams(searchParams: { [key: string]: any }) {
  return function (dispatch: Dispatch) {
    const {searchTerm, type, limit, offset} = searchParams;
    const params = {q: searchTerm, type, limit, include_external: 'audio', offset}
    return apiHandler.get('search', apiHandler.getAuthHeader(), params).then((response: AxiosResponse) => {
      return response.data;
    }).catch((error: AxiosError) => {
      console.log(error.response);
    });
  } as any
}
