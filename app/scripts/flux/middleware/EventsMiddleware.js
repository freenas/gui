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
              , [ [ "and"
                  , [ "name"
                    , "in"
                    , [ "alerts.filters.changed"
                      , "calendar_tasks.changed"
                      , "disks.changed"
                      , "groups.changed"
                      , "network.changed"
                      , "ntpservers.changed"
                      , "shares.changed"
                      , "tunables.changed"
                      , "update.changed"
                      , "users.changed"
                      , "volumes.changed"
                      , "fs.zfs.scrub.finish"
                      , "fs.zfs.scrub.start"
                      , "server.client_logged"
                   // , "server.client_loggedout"
                      , "server.shutdown"
                      , "system.network.interface.link_down"
                      , "system.network.interface.link_up"
                      , "update.changed"
                      ]
                    ]
                  ]
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
