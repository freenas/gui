// STORE CONFIGURATION FUNCTION
// ============================
// Abstracts away boilerplate associated with creating the Redux store and
// provides a single change point for future updates and changes.

"use strict";

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

import * as TYPES from "../actions/actionTypes";
import rootReducer from "../reducers";

const DO_NOT_SHOW = new Set([ TYPES.STATD_PULSE ]);

const loggerMiddleware = createLogger(
  { collapsed: true
  , predicate: ( getState, action ) => !DO_NOT_SHOW.has( action.type )
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
