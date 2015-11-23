// RIAK ACTION CREATORS
// ====================
// riak namespace

"use strict";

import { UPDATE_RIAK_FORM
       , RESET_RIAK_FORM
       , RIAK_CONFIG_REQUEST
       , CONFIGURE_RIAK_TASK_REQUEST
       , TOGGLE_RIAK_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateRiakForm ( field, value ) {
  return (
    { type: UPDATE_RIAK_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetRiakForm () {
  return (
    { type: RESET_RIAK_FORM }
  );
}

// QUERY
export function requestRiakConfig () {
  return ( dispatch ) => {
    MC.request( "service.get_service_config"
              , [ "riak" ]
              , ( UUID ) => dispatch( watchRequest( UUID, RIAK_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureRiakTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.riak.riakForm );
    var listener_protobuf_internal_port = formToSubmit.listener_protobuf_internal_port;
    var listener_http_internal_port = formToSubmit.listener_http_internal_port;
    var listener_https_internal_port = formToSubmit.listener_https_internal_port;
    if ( typeof listener_protobuf_internal_port === "string" ) {
      if ( listener_protobuf_internal_port === "" ) {
        formToSubmit.listener_protobuf_internal_port = null;
      } else {
        listener_protobuf_internal_port = Number.parseInt( listener_protobuf_internal_port );
        if ( !Number.isInteger( listener_protobuf_internal_port ) ) {
          throw new Error( "Attempted to submit an invalid value for"
                         + " listener_protobuf_internal_port to Riak."
                         );
        } else {
          formToSubmit.listener_protobuf_internal_port = listener_protobuf_internal_port;
        }
      }
    }
    if ( typeof listener_http_internal_port === "string" ) {
      if ( listener_http_internal_port === "" ) {
        formToSubmit.listener_http_internal_port = null;
      } else {
        listener_http_internal_port = Number.parseInt( listener_http_internal_port );
        if ( !Number.isInteger( listener_http_internal_port ) ) {
          throw new Error( "Attempted to submit an invalid value for"
                         + " listener_http_internal_port to Riak."
                         );
        } else {
          formToSubmit.listener_http_internal_port = listener_http_internal_port;
        }
      }
    }
    if ( typeof listener_https_internal_port === "string" ) {
      if ( listener_https_internal_port === "" ) {
        formToSubmit.listener_https_internal_port = null;
      } else {
        listener_https_internal_port = Number.parseInt( listener_https_internal_port );
        if ( !Number.isInteger( listener_https_internal_port ) ) {
          throw new Error( "Attempted to submit an invalid value for"
                         + " listener_https_internal_port to Riak."
                         );;
        } else {
          formToSubmit.listener_https_internal_port = listener_https_internal_port;
        }
      }
    }

    MC.submitTask( [ "service.configure", [ "riak", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_RIAK_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleRiakTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , [ "riak", { enable: !state.riak.riakServerState.enable } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_RIAK_TASK_REQUEST
                                         )
                   );
  }
};
