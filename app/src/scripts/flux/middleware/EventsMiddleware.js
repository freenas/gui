// Events Middleware
// =================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import MiddlewareBase from "./MIDDLEWARE_BASE_CLASS";
import { EVENTS as EVENTS_LIMIT } from "../constants/StoreLimits";

import EAC from "../actions/EventsActionCreators";

class EventsMiddleware extends MiddlewareBase {
  static requestEvents () {
    MC.request( "event.query"
              , [ []
                , { limit: EVENTS_LIMIT
                  , sort: "-id"
                  , dir: "desc"
                  }
                ]
              , EAC.receiveEvents
              );
  }
}

export default EventsMiddleware;
