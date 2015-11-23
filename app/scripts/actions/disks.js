// DISKS - ACTION CREATORS
// =======================

"use strict";

import { DISK_OVERVIEW_REQUEST } from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// DISK OVERVIEW
export function requestDiskOverview () {
  return ( dispatch, getState ) => {
    MC.request( "disk.query"
              , null
              , ( UUID ) =>
                dispatch( watchRequest( UUID, DISK_OVERVIEW_REQUEST ) )
              );
  }
}
