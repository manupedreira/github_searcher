import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { logger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import appReducer from "./appReducer";
import appSagas from "./appSagas";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["boot"]
};
const persistedReducer = persistReducer(persistConfig, appReducer);
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

let composeEnhancer = compose;

if (__DEV__) {
  middlewares.push(logger);
  // composeEnhancer = composeWithDevTools;
}

export default function configureStore() {
  const store = createStore(
    persistedReducer,
    composeEnhancer(applyMiddleware(...middlewares))
  );
  const persistor = persistStore(store);

  sagaMiddleware.run(appSagas);
  return { persistor, store };
}
