// HAPROXY ACTION CREATORS
// ====================
// haproxy namespace

"use strict";

import { UPDATE_HAPROXY_FORM
       , RESET_HAPROXY_FORM
       , HAPROXY_CONFIG_REQUEST
       , CONFIGURE_HAPROXY_TASK_REQUEST
       , TOGGLE_HAPROXY_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateHAProxyForm ( field, value ) {
  return (
    { type: UPDATE_HAPROXY_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetHAProxyForm () {
  return (
    { type: RESET_HAPROXY_FORM }
  );
};

// QUERY
export function requestHAProxyConfig () {
  return ( dispatch ) => {
    MC.request( "service.get_service_config"
              , [ "haproxy" ]
              , ( UUID ) => dispatch( watchRequest( UUID, HAPROXY_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureHAProxyTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.haproxy.haproxyForm );
    var defaults_maxconn = formToSubmit.defaults_maxconn;
    var https_port = formToSubmit.https_port;
    var global_maxconn = formToSubmit.global_maxconn;
    var http_port = formToSubmit.http_port;

    if ( typeof https_port === "string" ) {
      if ( https_port === "" ) {
        formToSubmit.https_port = null;
      } else {
        https_port = Number.parseInt( https_port );
        if ( !Number.isInteger( https_port ) ) {
          throw new Error( "Attempted to submit an invalid https port for "
                         + "HAProxy."
                         );
        } else {
          formToSubmit.https_port = https_port;
        }
      }
    }

    if ( typeof defaults_maxconn === "string" ) {
      if ( defaults_maxconn === "" ) {
        formToSubmit.defaults_maxconn = null;
      } else {
        defaults_maxconn = Number.parseInt( defaults_maxconn );
        if ( !Number.isInteger( defaults_maxconn ) ) {
          throw new Error( "Attempted to submit an invalid default maximum "
                         + "connection count for HAProxy."
                         );
        } else {
          formToSubmit.defaults_maxconn = defaults_maxconn;
        }
      }
    }

    if ( typeof http_port === "string" ) {
      if ( http_port === "" ) {
        formToSubmit.http_port = null;
      } else {
        http_port = Number.parseInt( http_port );
        if ( !Number.isInteger( http_port ) ) {
          throw new Error( "Attempted to submit an invalid http port for "
                         + "HAProxy."
                         );
        } else {
          formToSubmit.http_port = http_port;
        }
      }
    }

    if ( typeof global_maxconn === "string" ) {
      if ( global_maxconn === "" ) {
        formToSubmit.global_maxconn = null;
      } else {
        global_maxconn = Number.parseInt( global_maxconn );
        if ( !Number.isInteger( global_maxconn ) ) {
          throw new Error( "Attempted to submit an invalid global maximum "
                         + "connection count for HAProxy."
                         );
        } else {
          formToSubmit.global_maxconn = global_maxconn;
        }
      }
    }

    MC.submitTask( [ "service.configure", [ "haproxy", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_HAPROXY_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleHAProxyTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , [ "haproxy", { enable: !state.haproxy.haproxyServerState.enable } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_HAPROXY_TASK_REQUEST
                                         )
                   );
  };
};
