import { createStore, applyMiddleware, compose, Store } from "redux";
import { createLogger } from "redux-logger";
import modules from "./modules";

const logger = createLogger();

export default function configureStore(): Store {
  const composeEnhancers =
    (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  // const composeEnhancers = compose;
  const store = createStore(
    modules,
    composeEnhancers(applyMiddleware(logger))
    // composeEnhancers(applyMiddleware(ReduxThunk, penderMiddleware()))
  );
  return store;
}
