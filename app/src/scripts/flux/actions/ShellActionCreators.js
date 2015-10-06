// SHELL ACTION CREATORS
// =====================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

export default class ShellActionCreators {

  static receiveShells ( shells, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SHELLS
      , timestamp
      , shells
      }
    );
  }

}
