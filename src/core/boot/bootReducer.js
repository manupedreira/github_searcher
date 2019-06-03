import bootConstants from "./bootConstants";

export default function bootReducer(state = { prev: [] }, action) {
  switch (action.type) {
    case bootConstants.SAVE_PREV:
      return {
        prev: action.payload
      };
    case bootConstants.ADD_TO_PREV:
    default:
      return state;
  }
}
