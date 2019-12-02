import { createStore, applyMiddleware, compose, Store } from "redux";
import { createLogger } from "redux-logger";
import penderMiddleware from "redux-pender";
import ReduxThunk from "redux-thunk";
import modules from "./modules";

const logger = createLogger();

export default function configureStore(): Store {
  let store: Store;
  if (process.env.NODE_ENV === "development") {
    const composeEnhancers =
      (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose;
    store = createStore(
      modules,
      composeEnhancers(applyMiddleware(logger, ReduxThunk, penderMiddleware()))
      // composeEnhancers(applyMiddleware(ReduxThunk, penderMiddleware()))
    );
  } else {
    store = createStore(
      modules,
      compose(applyMiddleware(ReduxThunk, penderMiddleware()))
    );
  }

  return store;
}
