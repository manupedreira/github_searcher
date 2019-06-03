import { all, fork } from "redux-saga/effects";
import { bootSagas } from "src/core/boot";

const sagas = [...bootSagas];

export default function* root() {
  yield all(sagas.map(saga => fork(saga)));
}
