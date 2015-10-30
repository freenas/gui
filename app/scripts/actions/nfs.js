// NFS ACTION CREATORS
// ====================
// nfs namespace

"use strict";

import { UPDATE_NFS_FORM
       , RESET_NFS_FORM
       , NFS_CONFIG_REQUEST
       , CONFIGURE_NFS_TASK_REQUEST
       , TOGGLE_NFS_TASK_REQUEST
       , TOGGLE_NFS_V4_TASK_REQUEST
       }
  from "./actionTypes";
import MiddlewareClient from "../websocket/MiddlewareClient";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";

// FORM
export function updateNFSForm ( field, value ) {
  return (
    { type: UPDATE_NFS_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
}

export function resetNFSForm () {
  return (
    { type: RESET_NFS_FORM }
  );
}

// QUERY
export function requestNFSConfig () {
  return ( dispatch ) => {
    MC.request( "services.get_service_config"
              , [ "nfs" ]
              , ( UUID ) => dispatch( watchRequest( UUID, NFS_CONFIG_REQUEST ) )
              );
  };
};


// TASKS
export function configureNFSTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    var formToSubmit = Object.assign( {}, state.nfs.nfsForm );
    var server = formToSubmit.server;
    var mountd_port = formToSubmit.mountd_port;
    var rpclockd_port = formToSubmit.rpclockd_port;
    var rpcstatd_port = formToSubmit.rpcstatd_port;
    var server = formToSubmit.server;
    if ( typeof server === "string" ) {
      server = Number.parseInt( server );
      if ( !Number.isInteger( server ) ) {
        throw new Error( "Attempted to submit an invalid server count for "
                       + "NFS."
                       );
      } else {
        formToSubmit.server = server;
      }
    }
    if ( typeof mountd_port === "string" ) {
      if ( mountd_port === "" ) {
        formToSubmit.mountd_port = null;
      } else {
        mountd_port = Number.parseInt( mountd_port );
        if ( !Number.isInteger( mountd_port ) ) {
          throw new Error( "Attempted to submit an invalid mountd(8) bind port "
                         + "for NFS."
                         );
        } else {
          formToSubmit.mountd_port = mountd_port;
        }
      }
    }
    if ( typeof rpclockd_port === "string" ) {
      if ( rpclockd_port === "" ) {
        formToSubmit.rpclockd_port = null;
      } else {
        rpclockd_port = Number.parseInt( rpclockd_port );
        if ( !Number.isInteger( rpclockd_port ) ) {
          throw new Error( "Attempted to submit an invalid rpclockd(8) bind port "
                         + "for NFS."
                         );
        } else {
          formToSubmit.rpclockd_port = rpclockd_port;
        }
      }
    }
    if ( typeof rpcstatd_port === "string" ) {
      if ( rpcstatd_port === "" ) {
        formToSubmit.rpcstatd_port = null;
      } else {
        rpcstatd_port = Number.parseInt( rpcstatd_port );
        if ( !Number.isInteger( rpcstatd_port ) ) {
          throw new Error( "Attempted to submit an invalid rpcstatd (8) bind port"
                         + " for NFS."
                         );
        } else {
          formToSubmit.rpcstatd_port = rpcstatd_port;
        }
      }
    }

    if ( Object.keys( formToSubmit ).length === 0  ) {
      throw new Error( "Attempted to submit an unchanged NFS config." );
    }
    MC.submitTask( [ "service.configure", [ "nfs", formToSubmit ] ]
                 , ( UUID ) => dispatch( watchRequest
                                       , CONFIGURE_NFS_TASK_REQUEST
                                       )
                 );
  };
};

export function toggleNFSTaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , state.nfs.nfsServerState.enable
                   ? [ "nfs", { enable: false } ]
                   : [ "nfs", { enable: true } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_NFS_TASK_REQUEST
                                         )
                   );
  }
};

export function toggleNFSv4TaskRequest () {
  return ( dispatch, getState ) =>{
    const state = getState();
    MC.submitTask( [ "service.configure"
                   , state.nfs.nfsServerState.v4
                   ? [ "nfs", { v4: false } ]
                   : [ "nfs", { v4: true } ]
                   ]
                   , ( UUID ) => dispatch( watchRequest
                                         , TOGGLE_NFS_V4_TASK_REQUEST
                                         )
                   );
  }
};
