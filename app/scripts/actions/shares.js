// SHARES - ACTION CREATORS
// ========================

"use strict";

import * as TYPES from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// QUERIES
export function fetchShares () {
  return ( dispatch, getState ) => {
    MC.request( "share.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.SHARES_RPC_REQUEST ) )
              );
  }
}

export function submitShare ( volumeID, shareID ) {
  return ( dispatch, getState ) => {
    const state = getState();
    const ON_SERVER = state.shares.serverShares[ shareID ];
    const ON_CLIENT = state.shares.clientShares[ shareID ];
    delete ON_CLIENT.id;

    // FIXME: This is a workaround because magic shares don't make sense to me right now
    ON_CLIENT.target = state.volumes.serverVolumes[ volumeID ].name;

    if ( typeof shareID !== "string" ) {
      console.warn( "Expected `shareID` to be a string." );
      return;
    }

    if ( !ON_CLIENT || Object.keys( ON_CLIENT ).length === 0 ) {
      console.warn( `Share "${ shareID }" has no changes on the client` );
      return;
    }

    if ( ON_SERVER ) {
      MC.submitTask( [ "share.update", [ ON_SERVER.id, ON_CLIENT ] ]
                   , ( UUID ) =>
                     dispatch( watchRequest( UUID, TYPES.UPDATE_SHARE_TASK_SUBMIT_REQUEST ) )
                   );
    } else {
      MC.submitTask( [ "share.create", [ ON_CLIENT ] ]
                   , ( UUID ) =>
                     dispatch( watchRequest( UUID, TYPES.CREATE_SHARE_TASK_SUBMIT_REQUEST ) )
                   );
    }
  }
}

export function intendDeleteShare ( volumeID, shareID ) {
  return ( dispatch, getState ) => {
    const state = getState();

    if ( state.shares.serverShares.hasOwnProperty( shareID ) ) {
      dispatch (
        { type: TYPES.INTEND_DELETE_SHARE
        , payload: { shareID }
        }
      );
    } else {
      console.warn( `Share "${ shareID }" does not seem to exist:`
                  , state.shares.serverShares
                  );
    }
  }
}

export function cancelDeleteShare () {
  return { type: TYPES.CANCEL_DELETE_SHARE }
}

export function confirmDeleteShare ( volumeID ) {
  return ( dispatch, getState ) => {
    const state = getState();
    const TO_DELETE = state.shares.shareToDelete;
    const SERVER_SHARES = state.shares.serverShares;

    if ( !TO_DELETE ) {
      console.warn( "No share was marked for deletion" );
      return;
    }

    if ( !SERVER_SHARES.hasOwnProperty( TO_DELETE ) ) {
      console.warn( `${ TO_DELETE } is not present in the record of shares on `
                  + `the server`
                  );
      return;
    }

    MC.submitTask( [ "share.delete", [ TO_DELETE ] ]
                 , ( UUID ) =>
                   dispatch( watchRequest( UUID, TYPES.DELETE_SHARE_TASK_SUBMIT_REQUEST ) )
                 );
  }
}


// CLIENT
export function updateShare ( volumeID, shareID, shareData ) {
  return { type: TYPES.UPDATE_SHARE
         , payload:
           { id: shareID
           , data: shareData
           }
         };
};

export function revertShare ( volumeID, shareID ) {
  return { type: TYPES.REVERT_SHARE
         , payload:
           { id: shareID }
         };
}


// GUI
export function focusShare ( volumeID, shareID ) {
  return { type: TYPES.FOCUS_SHARE
         , payload: { shareID }
         };
}

export function blurShare ( volumeID, shareID ) {
  return { type: TYPES.BLUR_SHARE };
}
