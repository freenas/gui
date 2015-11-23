// RIAK CS ACTION CREATORS
// =======================
// riakcs namespace

"use strict";

import { UPDATE_RIAKCS_FORM
       , RESET_RIAKCS_FORM
       , RIAKCS_CONFIG_REQUEST
       , CONFIGURE_RIAKCS_TASK_REQUEST
       , TOGGLE_RIAKCS_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateRiakCSForm ( field, value ) {
  return (
    { type: UPDATE_RIAKCS_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetRiakCSForm () {
  return (
    { type: RESET_RIAKCS_FORM }
  );
}

// QUERY
export function requestRiakCSConfig () {
  return ( dispatch ) => {
    MC.request( "service.get_service_config"
              , [ "riak_cs" ]
              , ( UUID ) => dispatch( watchRequest( UUID, RIAKCS_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureRiakCSTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.riakcs.riakCSForm )

    var stanchion_host_port = formToSubmit.stanchion_host_port;
    var listener_port = formToSubmit.listener_port;
    var max_buckets_per_user = formToSubmit.max_buckets_per_user;

    if ( typeof stanchion_host_port === "string" ) {
      if ( stanchion_host_port === "" ) {
        formToSubmit.stanchion_host_port = null;
      } else {
        stanchion_host_port = Number.parseInt( stanchion_host_port );
        if ( !Number.isInteger( stanchion_host_port ) ) {
          throw new Error( "Attempted to submit an invalid value for"
                         + " stanchion_host_port to Riak CS."
                         );
        } else {
          formToSubmit.stanchion_host_port = stanchion_host_port;
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
                         + " listener_port to Riak CS."
                         );
        } else {
          formToSubmit.listener_port = listener_port;
        }
      }
    }

    if ( typeof max_buckets_per_user === "string" ) {
      if ( max_buckets_per_user === "" ) {
        formToSubmit.max_buckets_per_user = null;
      } else {
        max_buckets_per_user = Number.parseInt( max_buckets_per_user );
        if ( !Number.isInteger( max_buckets_per_user ) ) {
          throw new Error( "Attempted to submit an invalid value for"
                         + " max_buckets_per_user to Riak CS."
                         );
        } else {
          formToSubmit.max_buckets_per_user = max_buckets_per_user;
        }
      }
    }

    MC.submitTask( [ "service.configure", [ "riak_cs", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_RIAKCS_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleRiakCSTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , [ "riak_cs"
                     , { enable: !state.riakcs.riakcsServerState.enable }
                     ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_RIAKCS_TASK_REQUEST
                                         )
                   );
  }
};
