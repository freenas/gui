// SHELLS - ACTIONS
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";
import MC from "../websocket/MiddlewareClient";


// FETCH AVAILABLE SHELLS
function getShellsRequest( UUID ) {
  return { type: TYPES.GET_SHELLS_REQUEST
         , payload: { UUID }
         };
}

export function fetchShells () {
  return ( dispatch, getState ) => {
    MC.request( "shell.get_shells"
              , null
              , ( UUID ) => dispatch( getShellsRequest( UUID ) )
              );
  }
}

// SPAWN NEW SHELL
function spawnShellRequest ( UUID ) {
  return { type: TYPES.SPAWN_SHELL_REQUEST
         , payload: { UUID }
         };
}

export function spawnShell ( shellType ) {
  return ( dispatch, getState ) => {
    MC.request( "shell.spawn"
              , [ shellType ]
              , ( UUID ) => dispatch( spawnShellRequest( UUID ) )
              );
  }
}
