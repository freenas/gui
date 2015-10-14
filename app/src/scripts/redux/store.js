// REDUX STORE
// ===========

"use strict";

import { createStore } from "redux";

import rootReducer from "./rootReducer";

let store = createStore( rootReducer );
