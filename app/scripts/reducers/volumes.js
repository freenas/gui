// VOLUMES - REDUCER
// =================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID, handleChangedEntities, payloadIsType }
  from "../utility/Reducer";
import DiskUtilities from "../utility/DiskUtilities";
import FreeNASUtil from "../utility/freeNASUtil";
import * as ZFSConstants from "../constants/ZFSConstants";
import ZfsUtil from "../views/Storage/utility/ZfsUtil"; // TODO: UGH SERIOUSLY?

const INITIAL_STATE =
  // RPC REQUEST TRACKING
  { volumesRequests: new Set()
  , availableDisksRequests: new Set()
  , createRequests: new Set()
  , destroyRequests: new Set()

  // TASK TRACKING
  , activeTasks: new Set()

  , serverVolumes: {}
  , clientVolumes: {}

  , activeVolume: ""
  , activeShare: ""
  , volumeToDestroy: ""
  , shareToDelete: { path: null, pool: null }
  , availableDisks: new Set()
  , selectedDisks: new Set()
  };


function normalizeVolumes ( volumes ) {
  let normalized = {};

  volumes.forEach( volume => normalized[ volume.id ] = volume );

  return normalized;
}

function getActiveVolume ( activeVolume, clientVolumes, serverVolumes ) {
  const CLIENT = new Set( Object.keys( clientVolumes ) );
  const SERVER = new Set( Object.keys( serverVolumes ) );

  if ( activeVolume && CLIENT.has( activeVolume ) || SERVER.has( activeVolume ) ) {
    return activeVolume;
  } else if ( SERVER.size ) {
    if ( activeVolume ) {
      console.warn( `activeVolume "${ activeVolume }" was not present in state.\n`
                  + `Falling back to first value in serverVolumes`
                  );
    }
    return SERVER.values().next().value;
  } else if ( CLIENT.size ) {
    if ( activeVolume ) {
      console.warn( `activeVolume "${ activeVolume }" was not present in state.\n`
                  + `Falling back to first value in clientVolumes`
                  );
    }
    return CLIENT.values().next().value;
  } else {
    return "";
  }
}

export default function volumes ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let newState;
  let activeTasks;
  let clientVolumes;
  let serverVolumes;
  let diskPathsByType;
  let topologyData;
  let selectedDisks;
  let changedVolumes;

  switch ( type ) {

  // CLIENT ACTIONS
  // ==============

    // INITIALIZE A NEW VOLUME
    case TYPES.INIT_NEW_VOLUME:
      clientVolumes = Object.assign( {}, state.clientVolumes );

      clientVolumes[ payload.volumeID ] = payload.newVolume;

      return Object.assign( {}
                          , state
                          , { clientVolumes
                            , activeVolume: payload.volumeID
                            }
                          );


    // UPDATE CLIENT CHANGES
    case TYPES.UPDATE_VOLUME:
      clientVolumes = Object.assign( {}, state.clientVolumes );

      clientVolumes[ payload.volumeID ] =
        Object.assign( {}, clientVolumes[ payload.volumeID ], payload.patch );

      return Object.assign( {}, state, { clientVolumes } );


    // DISCARD CLIENT CHANGES
    case TYPES.REVERT_VOLUME:
      clientVolumes = Object.assign( {}, state.clientVolumes );

      if ( clientVolumes.hasOwnProperty( payload.volumeID ) ) {
        delete clientVolumes[ payload.volumeID ];
        return Object.assign( {}, state, { clientVolumes } );
      } else {
        console.warn( `Could not revert ${ payload.volumeID } because it does `
                    + `not exist in state.`
                    );
        return state;
      }


    case TYPES.UPDATE_VOLUME_TOPOLOGY:
      clientVolumes = Object.assign( {}, state.clientVolumes );

      topologyData =
        ZfsUtil.createTopology( payload.availableHDDs
                              , payload.availableSSDs
                              , payload.preferences
                              );

      clientVolumes[ payload.volumeID ].preset = "None";
      clientVolumes[ payload.volumeID ].topology = topologyData[0];

      selectedDisks = new Set( topologyData[1] );

      return Object.assign( {}, state, { clientVolumes, selectedDisks } );

    case TYPES.REVERT_VOLUME_TOPOLOGY:
      clientVolumes = Object.assign( {}, state.clientVolumes );

      clientVolumes[ payload.volumeID ].preset = "None";
      clientVolumes[ payload.volumeID ].topology =
        Object.assign( {}, ZFSConstants.BLANK_TOPOLOGY );

      selectedDisks = new Set();

      return Object.assign( {}, state, { clientVolumes, selectedDisks } );


    case TYPES.FOCUS_VOLUME:
      return Object.assign( {}, state, { activeVolume: payload.volumeID } );

    case TYPES.BLUR_VOLUME:
      if ( payload.volumeID !== state.activeVolume ) {
        console.warn( `Tried to blur ${ payload.volumeID }, `
                    + `but ${ state.activeVolume } is the active volume!`
                    );
        return state;
      } else {
        return Object.assign( {}, state, { activeVolume: "" } );
      }


    case TYPES.SELECT_PRESET_TOPOLOGY:
      if ( state.serverVolumes.hasOwnProperty( payload.volumeID ) ) {
        console.warn( `Cannot apply preset to ${ payload.volumeID }, `
                    + `since it exists on the server. ( What are you doing? )`
                    );
        return state;
      }

      clientVolumes = Object.assign( {}, state.clientVolumes );
      if ( clientVolumes.hasOwnProperty( payload.volumeID ) ) {
        if ( payload.preset.toUpperCase() === "NONE" ) {
          clientVolumes[ payload.volumeID ].preset = "None";
        } else if ( ZFSConstants.PRESET_VALUES.hasOwnProperty( payload.preset ) ) {
          topologyData =
            ZfsUtil.createTopology( payload.availableHDDs
                                  , payload.availableSSDs
                                  , ZFSConstants.PRESET_VALUES[ payload.preset ]
                                  );

          clientVolumes[ payload.volumeID ].preset = payload.preset;
          clientVolumes[ payload.volumeID ].topology = topologyData[0];
          selectedDisks = new Set( topologyData[1] );

          return Object.assign( {}, state, { clientVolumes, selectedDisks } );
        } else {
          console.warn( `The preset "${ payload.preset }" doesn't exist.` );
          return state;
        }

        return Object.assign( {}, state, clientVolumes );
      } else {
        console.warn( `Cannot apply preset to ${ payload.volumeID }, `
                    + `since does not exist on the client ( New volume not `
                    + `initialized?`
                    );
        return state;
      }


    case TYPES.SELECT_DISK:
      selectedDisks = new Set( state.selectedDisks );
      selectedDisks.add( payload.path );
      return Object.assign( {}, state, { selectedDisks } );

    case TYPES.DESELECT_DISK:
      selectedDisks = new Set( state.selectedDisks );
      selectedDisks.delete( payload.path );
      return Object.assign( {}, state, { selectedDisks } );


    case TYPES.INTEND_DESTROY_VOLUME:
      return Object.assign( {}, state, { volumeToDestroy: payload.volumeID } );

    case TYPES.CANCEL_DESTROY_VOLUME:
      return Object.assign( {}, state, { volumeToDestroy: "" } );



  // RPC AND TASK ACTIONS
  // ====================

    // GET VOLUMES ON SERVER
    case TYPES.VOLUMES_RPC_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "volumesRequests" )
                          );

    // AVAILABLE DISKS
    case TYPES.AVAILABLE_DISKS_RPC_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "availableDisksRequests" )
                          );

    // SUBMIT NEW VOLUME
    case TYPES.CREATE_VOLUME_TASK_SUBMIT_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "createRequests" )
                          );

    // SUBMIT NEW VOLUME
    case TYPES.DESTROY_VOLUME_TASK_SUBMIT_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID, state, "destroyRequests" )
                          );

    // RPC REQUEST RESOLUTION
    case TYPES.RPC_SUCCESS:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_TIMEOUT:

      // HANDLE VOLUMES DATA
      if ( state.volumesRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          serverVolumes = normalizeVolumes( payload.data );
          newState =
            { serverVolumes
            , activeVolume: getActiveVolume( state.activeVolume
                                           , state.clientVolumes
                                           , serverVolumes
                                           )
            };

          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "volumesRequests" )
                              , newState
                              );
        } else {
          console.warn( "Volumes query did not return any data" );
          return state;
        }
      }

      // HANDLE AVAILABLE DISKS
      if ( state.availableDisksRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "availableDisksRequests" )
                              , { availableDisks: new Set( payload.data ) }
                              );
        } else {
          console.warn( "Available disks query did not return any data" );
          return state;
        }
      }

      // VOLUME SUBMIT TASK
      if ( state.createRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "createRequests" )
                              );
        } else {
          console.warn( "Volume Submit task did not return a task ID" );
          return state;
        }
      }

      // VOLUME DESTROY TASK
      if ( state.destroyRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID, state, "destroyRequests" )
                              , { volumeToDestroy: "" }
                              );
        } else {
          console.warn( "Volume Destroy task did not return a task ID" );
          return state;
        }
      }

    // TRACK ACTIVE TASKS
    case TYPES.TASK_CREATED:
    case TYPES.TASK_UPDATED:
    case TYPES.TASK_PROGRESS:
      if ( payloadIsType( payload, "volume" ) ) {
        activeTasks = new Set( state.activeTasks );
        activeTasks.add( payload.data.id );
        return Object.assign( {}, state, { activeTasks } );
      }
      return state;

    case TYPES.TASK_FINISHED:
    case TYPES.TASK_FAILED:
      if ( payloadIsType( payload, "volume" ) ) {
        activeTasks = new Set( state.activeTasks );
        activeTasks.delete( payload.data.id );
        return Object.assign( {}, state, { activeTasks } );
      }
      return state;


    case TYPES.ENTITY_CHANGED:
      if ( payload.mask === "volumes.changed" ) {
        serverVolumes = handleChangedEntities( payload, state.serverVolumes );
        newState =
          { serverVolumes
          , activeVolume: getActiveVolume( state.activeVolume
                                         , state.clientVolumes
                                         , serverVolumes
                                         )
          };

        return Object.assign( {}, state, newState );
      }
      return state;


    default:
      return state;
  }
}
