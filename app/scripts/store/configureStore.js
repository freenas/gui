// STORE CONFIGURATION FUNCTION
// ============================
// Abstracts away boilerplate associated with creating the Redux store and
// provides a single change point for future updates and changes.

"use strict";

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

import rootReducer from "../reducers";

const loggerMiddleware = createLogger(
  { collapsed: true
  }
);

const createStoreWithMiddleware =
  applyMiddleware( thunkMiddleware, loggerMiddleware )( createStore );

export default function configureStore ( initialState ) {
  const store = createStoreWithMiddleware( rootReducer, initialState );

  if ( module.hot ) {
    // Configure Webpack HMR to accept changing reducers without a reload
    module.hot.accept( "../reducers", () => {
      const nextReducer = require( "../reducers" );
      store.replaceReducer( nextReducer );
    });
  }

  return store;
}
