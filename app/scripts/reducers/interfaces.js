// INTERFACES REDUCER
// ==================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { networkInterfacesRequests: new Set()
  , toggleInterfaceTaskRequests: new Set()
  , interfaceConfigureTaskRequests: new Set()
  , interfaces: {}
  , interfaceChanges: {}
  , loopback: new Set()
  , ether: new Set()
  , vlan: new Set()
  , bridge: new Set()
  , lagg: new Set()
  , unknown: new Set()
  };

// Destructure interfaces and sort them by type.
function categorizeInterfaces ( client, server ) {
  var newInterfaces =
    { interfaces: {}
    , loopback: new Set()
    , ether: new Set()
    , vlan: new Set()
    , bridge: new Set()
    , lagg: new Set()
    , unknown: new Set()
    };

  server.forEach( networkInterface => {
    newInterfaces[ networkInterface.id ] = networkInterface;

    switch ( networkInterface.type ) {
      case "LOOPBACK":
        newInterfaces.loopback.add( networkInterface.id );
        break;
      case "ETHER":
        newInterfaces.ether.add( networkInterface.id );
        break;
      case "VLAN":
        newInterfaces.vlan.add( networkInterface.id );
        break;
      case "BRIDGE":
        newInterfaces.bridge.add( networkInterface.id );
        break;
      case "LAGG":
        newInterfaces.lagg.add( networkInterface.id );
        break;
      default:
        newInterfaces.unknown.add( networkInterface.id );
    }
  });

  return Object.assign( {}, client, newInterfaces );
}

export default function interfaces ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  var interfaces;
  var interfaceChanges;
  var networkInterfacesRequests;

  switch ( type ) {
    case TYPES.NETWORK_INTERFACES_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "networkInterfacesRequests"
                                      )
                          );

    // EDITING
    // TODO: Delete interfaceChanges object for interfaces that have been
    // manually returned to an unedited state.
    case TYPES.UPDATE_INTERFACE:
      interfaceChanges = Object.assign( state.interfaceChanges );
      if ( interfaceChanges[ payload.interfaceID ] ) {
        interfaceChanges[ payload.interfaceID ][ payload.path ] = payload.value;
      } else {
        interfaceChanges[ payload.interfaceID ] = { [ payload.path ]: payload.value };
      }
      return Object.assign( {}, state, { interfaceChanges } );

    case TYPES.RESET_INTERFACE:
      interfaceChanges = Object.assign( state.interfaceChanges );
      if ( interfaceChanges[ payload.interfaceID ] ) {
        delete interfaceChanges[ payload.interfaceID ];
      }
      return Object.assign( {}, state, { interfaceChanges } );

    // TASKS
    case TYPES.INTERFACE_CONFIGURE_TASK_SUBMIT:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "interfaceConfigureTaskRequests"
                                      )
                          );


    case TYPES.TOGGLE_INTERFACE_TASK_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "toggleInterfaceTaskRequests"
                                      )
                          );

    // RPC REQUEST RESOLUTION
    case TYPES.RPC_SUCCESS:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_TIMEOUT:
      // HANDLE INTERFACES DATA
      if ( state.networkInterfacesRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          interfaces = categorizeInterfaces( null, payload.data );

          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state
                                           , "networkInterfacesRequests"
                                           )
                              , interfaces
                              );
        } else {
          console.warn( "Network interfaces query did not return any data" );
        }
        return state;
      }

    default:
      return state;
  }
};
