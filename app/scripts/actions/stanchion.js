// STANCHION ACTION CREATORS
// =========================
// stanction namespace

"use strict";

import { UPDATE_STANCHION_FORM
       , RESET_STANCHION_FORM
       , STANCHION_CONFIG_REQUEST
       , CONFIGURE_STANCHION_TASK_REQUEST
       , TOGGLE_STANCHION_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateStanchionForm ( field, value ) {
  return (
    { type: UPDATE_STANCHION_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetStanchionForm () {
  return (
    { type: RESET_STANCHION_FORM }
  );
}

// QUERY
export function requestStanchionConfig () {
  return ( dispatch ) => {
    MC.request( "services.get_service_config"
              , [ "stanchion" ]
              , ( UUID ) => dispatch( watchRequest( UUID, STANCHION_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureStanchionTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.stanchion.stanchionForm )

    var riak_host_port = formToSubmit.riak_host_port;
    var listener_port = formToSubmit.listener_port;

    if ( typeof riak_host_port === "string" ) {
      if ( riak_host_port === "" ) {
        formToSubmit.riak_host_port = null;
      } else {
        riak_host_port = Number.parseInt( riak_host_port );
        if ( !Number.isInteger( riak_host_port ) ) {
          throw new Error( "Attempted to submit an invalid value for"
                         + " riak_host_port to Stanchion."
                         );
        } else {
          formToSubmit.riak_host_port = riak_host_port;
        }
      }
    }

    if ( typeof listener_port === "string" ) {
      if ( listener_port === "" ) {
        formToSubmit.listener_port = null;
      } else {
        listener_port = Number.parseInt( listener_port );
        if ( !Number.isInteger( listener_port ) ) {
          throw new Error( "Attempted to submit an invalid value for"
                         + " listener_port to Stanchion."
                         );
        } else {
          formToSubmit.listener_port = listener_port;
        }
      }
    }

    MC.submitTask( [ "service.configure", [ "stanchion", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_STANCHION_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleStanchionTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , state.stanchion.stanchionServerState.enable
                   ? [ "stanchion", { enable: false } ]
                   : [ "stanchion", { enable: true } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_STANCHION_TASK_REQUEST
                                         )
                   );
  }
};
