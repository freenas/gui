// Events Action Creators
// ======================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

class EventsActionCreators {

  static receiveEvents ( events, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_EVENTS
      , timestamp
      , events
      }
    );
  }
}

export default EventsActionCreators;
