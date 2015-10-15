// Stats Action Creators
// =====================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

class StatdActionCreators {

  static receiveStatdData ( dataSourceName, statdData, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_STATD_DATA
      , dataSourceName
      , statdData
      , timestamp
      }
    );
  }
};

export default StatdActionCreators;
