// NETWORK - ACTION CREATORS
// =========================

"use strict";

import _ from "lodash";
import * as TYPES from "../actions/actionTypes";
import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// DISK OVERVIEW
export function requestNetworkConfig () {
  return ( dispatch, getState ) => {
    MC.request( "network.config.get_global_config"
              , null
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.NETWORK_CONFIG_REQUEST ) )
              );
  }
}

export function updateNetworkConfig ( path, value ) {
  return ( dispatch, getState ) => {
    const state = getState();

    if ( _.has( state.network.serverConfig, path ) ) {
      dispatch(
        { type: TYPES.UPDATE_NETWORK_CONFIG
        , payload: { path, value }
        }
      );
    } else {
      console.warn( `Path "${ path }" does not exist in serverConfig`, serverConfig );
    }
  }
}

export function revertNetworkConfig () {
  return { type: TYPES.REVERT_NETWORK_CONFIG }
}

function networkConfigAC ( UUID ) {
  return { type: TYPES.NETWORK_CONFIGURE_TASK_SUBMIT
         , payload: { UUID }
         }
}

export function submitNetworkConfig () {
  return ( dispatch, getState ) => {
    const state = getState();

    if ( Object.keys( state.network.clientConfig ).length ) {
      MC.submitTask( [ "network.configure", [ state.network.clientConfig ] ]
                   , ( UUID ) => dispatch( networkConfigAC( UUID ) )
                   );
    // System hostname is handled in another file, but makes this warning bogus
    // Is hiding this warning in that case also bogus?
    } else if ( !state.system.hostnameEdit ) {
      console.warn( "Can't submit an empty form" );
    }
  }
}

export function requestInterfaces () {
  return ( dispatch, getState ) => {
    MC.request( "network.interfaces.query"
              , null
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.INTERFACES_REQUEST ) )
              );
  }
}