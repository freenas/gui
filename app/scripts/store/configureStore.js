// STORE CONFIGURATION FUNCTION
// ============================
// Abstracts away boilerplate associated with creating the Redux store and
// provides a single change point for future updates and changes.

"use strict";

import { createStore } from "redux";

import rootReducer from "../reducers";

export default function configureStore ( initialState ) {
  const store = createStore( rootReducer, initialState );

  if ( module.hot ) {
    // Configure Webpack HMR to accept changing reducers without a reload
    module.hot.accept( "../reducers", () => {
      const nextReducer = require( "../reducers" );
      store.replaceReducer( nextReducer );
    });
  }

  return store;
}
