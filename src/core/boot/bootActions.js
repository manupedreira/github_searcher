import bootConstants from "./bootConstants";

export function addToPrev(search) {
  return {
    type: bootConstants.ADD_TO_PREV,
    payload: search
  };
}

export function savePrev(prev) {
  return {
    type: bootConstants.SAVE_PREV,
    payload: prev
  };
}
