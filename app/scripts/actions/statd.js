// STATD ACTION CREATORS
// =====================

"use strict";

import moment from "moment";

import * as TYPES from "../actions/actionTypes";
import { add as subscribe, remove as unsubscribe }
  from "../actions/subscriptions";
import MC from "../websocket/MiddlewareClient";

function pulseSyntax ( dataSource ) {
  return "statd." + dataSource + ".pulse";
};

function fetchRequest ( UUID, source ) {
  return { type: TYPES.STATD_HISTORY_REQUEST
         , payload: { UUID, source }
         }
}

export function fetchHistory ( sources) {
  return ( dispatch, getState ) => {
    const frequency = 10; // FIXME: This was always hardcoded
    const now = moment().format();
    // Hardcoded to the past 60 seconds of data.
    const startTime = moment( now ).subtract( frequency * 60, "seconds" ).format();

    sources.forEach( source => {
      MC.request( "statd.output.query"
                , [ source
                  , { start: startTime
                    , end: now
                    , frequency: frequency + "S"
                    }
                  ]
                , ( UUID ) => dispatch( fetchRequest( UUID, source ) )
                );
    });
  }
}

export function pulseSubscribe ( sources, id ) {
  return dispatch => dispatch( subscribe( sources.map( pulseSyntax ), id ) );
}

export function pulseUnsubscribe ( sources, id ) {
  return dispatch => dispatch( unsubscribe( sources.map( pulseSyntax ), id ) );
}
