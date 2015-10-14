// SHARES ACTION CREATORS
// ======================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

export default class SharesActionCreators {
  static receiveShares ( shares, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_SHARES
      , timestamp
      , shares
      }
    );
  }
}
