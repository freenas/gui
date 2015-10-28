// SHELLS - ACTIONS
// ================

"use strict";

import { GET_SHELLS_REQUEST, SPAWN_SHELL_REQUEST }
  from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// FETCH AVAILABLE SHELLS
export function fetchShells () {
  return ( dispatch, getState ) => {
    MC.request( "shell.get_shells"
              , null
              , ( UUID ) =>
                dispatch( watchRequest( UUID, GET_SHELLS_REQUEST ) )
              );
  }
}

// SPAWN NEW SHELL
export function spawnShell ( shellType ) {
  return ( dispatch, getState ) => {
    MC.request( "shell.spawn"
              , [ shellType ]
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SPAWN_SHELL_REQUEST ) )
              );
  }
}
