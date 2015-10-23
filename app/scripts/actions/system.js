// SYSTEM ACTION CREATORS
// =======================

"use strict";

import * as TYPES from "./actionTypes";
import MC from "../websocket/MiddlewareClient";


// OS FORM
export function updateOSForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_OS_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetOSForm () {
  return ( { type: TYPES.RESET_OS_FORM } );
};


// CONNECTION FORM
/*
export function updateConnectionForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_CONNECTION_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetConnectionForm () {
  return ( { type: TYPES.RESET_CONNECTION_FORM } );
};
*/

// LOCALIZATION FORM
export function updateLocalizationForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_LOCALIZATION_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetLocalizationForm () {
  return ( { type: TYPES.RESET_LOCALIZATION_FORM } );
};


// CONSOLE FORM
export function updateConsoleForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_CONSOLE_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetConsoleForm () {
  return ( { type: TYPES.RESET_CONSOLE_FORM } );
};

export function resetConsoleForm () {
  return ( { type: TYPES.RESET_CONSOLE_FORM } );
};
