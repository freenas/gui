// SHARES - ACTION CREATORS
// ========================

"use strict";

import * as TYPES from "./actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// MIDDLEWARE
export function fetchShares () {
  return ( dispatch, getState ) => {
    MC.request( "shares.query"
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
    const TO_SUBMIT = Object.assign( {}, ON_CLIENT );
    delete TO_SUBMIT.id;

    // FIXME: This is a workaround because magic shares don't make sense to me right now
    TO_SUBMIT.target = state.volumes.serverVolumes[ volumeID ].name;

    if ( typeof shareID !== "string" ) {
      console.warn( "Expected `shareID` to be a string." );
      return;
    }

    if ( !ON_CLIENT || Object.keys( ON_CLIENT ).length === 0 ) {
      console.warn( `Share "${ shareID }" has no changes on the client` );
      return;
    }

    if ( ON_SERVER ) {
      MC.submitTask( [ "share.update", [ TO_SUBMIT ] ]
                   , ( UUID ) =>
                     dispatch( watchRequest( UUID, TYPES.UPDATE_SHARE_TASK_SUBMIT_REQUEST ) )
                   );
    } else {
      MC.submitTask( [ "share.create", [ TO_SUBMIT ] ]
                   , ( UUID ) =>
                     dispatch( watchRequest( UUID, TYPES.CREATE_SHARE_TASK_SUBMIT_REQUEST ) )
                   );
    }
  }
}

export function deleteShare ( volumeID ) {
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
