import { put, select, takeEvery } from "redux-saga/effects";
import bootConstants from "./bootConstants";
import * as actions from "./bootActions";

function* addToPrev(action) {
  try {
    const prev = yield select(state => state.boot.prev || []);
    if (prev.indexOf(action.payload) >= 0) return;
    if (prev.length === 10) prev.pop();
    prev.unshift(action.payload);
    yield put(actions.savePrev(prev));
  } catch (error) {
    console.log("----------Error saving search");
  }
}

function* watchAddToPrev() {
  yield takeEvery(bootConstants.ADD_TO_PREV, addToPrev);
}

export default [watchAddToPrev];
