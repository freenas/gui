// VOLUMES - ACTIONS
// =================

"use strict";

import * as TYPES from "./actionTypes";
import { watchRequest } from "../utility/Action";
import FreeNASUtil from "../utility/freeNASUtil";
import * as ZFSConstants from "../constants/ZFSConstants";
import MC from "../websocket/MiddlewareClient";
import ZfsUtil from "../views/Storage/utility/ZfsUtil"; // TODO: UGH SERIOUSLY?

function getAvailableDisks ( state ) {
  return [ Array.from( state.disks.SSDs )
                .filter( path => state.volumes.availableDisks.has( path ) )
         , Array.from( state.disks.HDDs )
                .filter( path => state.volumes.availableDisks.has( path ) )
         ]
}

function volumeExistsOnClient ( volumeID, state ) {
  if ( state.volumes.clientVolumes.hasOwnProperty( volumeID ) ) {
    return true;
  } else {
    console.warn( `Volume "${ volumeID } doesn't exist on the client` );
    return false;
  }
}

function volumeExistsOnServer ( volumeID, state ) {
  if ( state.volumes.serverVolumes.hasOwnProperty( volumeID ) ) {
    return true;
  } else {
    console.warn( `Volume "${ volumeID } doesn't exist on the server` );
    return false;
  }
}

function volumeExists ( volumeID, state ) {
  if ( state.volumes.serverVolumes.hasOwnProperty( volumeID )
    || state.volumes.clientVolumes.hasOwnProperty( volumeID ) ) {
    return true;
  } else {
    console.warn( `Volume "${ volumeID } doesn't exist on the client or server` );
    return false;
  }
}

// VOLUMES REQUEST
export function fetchVolumes () {
  return ( dispatch, getState ) => {
    MC.request( "volume.query"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.VOLUMES_RPC_REQUEST ) )
              );
  }
}

// AVAILABLE DISKS REQUEST
export function fetchAvailableDisks () {
  return ( dispatch, getState ) => {
    MC.request( "volume.get_available_disks"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, TYPES.AVAILABLE_DISKS_RPC_REQUEST ) )
              );
  }
}

export function fetchAvailableDisksIfNeeded () {
  return ( dispatch, getState ) => {
    const state = getState();

    if ( state.volumes.availableDisksRequests.size === 0
      && state.volumes.availableDisksInvalid ) {
      dispatch( fetchAvailableDisks() );
    }
  }
}

// INIT NEW VOLUME ON CLIENT
export function initNewVolume () {
  const volumeID = FreeNASUtil.generateUUID();
  const newVolume = Object.assign( ZFSConstants.createVolumeInitialValues(), { volumeID } );

  return { type: TYPES.INIT_NEW_VOLUME
         , payload: { volumeID, newVolume }
         };
}

// UPDATE CLIENT VOLUME DATA
export function updateVolume ( volumeID, patch ) {
  return { type: TYPES.UPDATE_VOLUME
         , payload: { volumeID, patch }
         };
}

// REVERT CLIENT CHANGES TO VOLUME
export function revertVolume ( volumeID ) {
  return { type: TYPES.REVERT_VOLUME
         , payload: { volumeID }
         }
}


export function updateTopology ( volumeID, preferences ) {
  return ( dispatch, getState ) => {
    let state = getState();
    let availableDisks = getAvailableDisks( state );

    dispatch(
      { type: TYPES.UPDATE_VOLUME_TOPOLOGY
      , payload:
        { volumeID
        , preferences
        , availableSSDs: availableDisks[0]
        , availableHDDs: availableDisks[1]
        }
      }
    );
  }
}

export function revertTopology ( volumeID ) {
  return ( dispatch, getState ) => {
    let state = getState();

    if ( volumeExistsOnClient( volumeID, state ) ) {
      dispatch(
        { type: TYPES.REVERT_VOLUME_TOPOLOGY
        , payload: { volumeID }
        }
      );
    }
  }
}

export function focusVolume ( volumeID ) {
  return { type: TYPES.FOCUS_VOLUME
         , payload: { volumeID }
         };
}

export function blurVolume ( volumeID ) {
  return { type: TYPES.BLUR_VOLUME
         , payload: { volumeID }
         };
}

export function selectPresetTopology ( volumeID, preset ) {
  return ( dispatch, getState ) => {
    let state = getState();
    let availableDisks = getAvailableDisks( state );

    if ( volumeExistsOnClient( volumeID, state ) ) {
      dispatch(
        { type: TYPES.SELECT_PRESET_TOPOLOGY
        , payload:
          { volumeID
          , preset
          , availableSSDs: availableDisks[0]
          , availableHDDs: availableDisks[1]
          }
        }
      );
    }
  }
}

export function selectDisk ( volumeID, path ) {
  return ( dispatch, getState ) => {
    let state = getState();

    if ( state.volumes.availableDisks.has( path ) ) {
      dispatch(
        { type: TYPES.SELECT_DISK
        , payload: { volumeID, path }
        }
      );
    } else {
      console.warn( `Tried to select ${ path }, but it is marked as unavailable.` );
    }
  }
}

export function deselectDisk ( volumeID, path ) {
  return ( dispatch, getState ) => {
    let state = getState();

    if ( !state.volumes.availableDisks.has( path ) ) {
      console.warn( `Deselecting ${ path }, but it is marked as unavailable. `
                  + `This means it should never have been selected in the `
                  + `first place.`
                  );
    }

    dispatch(
      { type: TYPES.DESELECT_DISK
      , payload: { volumeID, path }
      }
    );

  }
}

function volumeCreateAC ( UUID, volumeID ) {
  return { type: TYPES.CREATE_VOLUME_TASK_SUBMIT_REQUEST
         , payload: { UUID, volumeID }
         }
}

export function submitVolume ( volumeID ) {
  return ( dispatch, getState ) => {
    const state = getState();

    if ( volumeExistsOnClient( volumeID, state ) ) {
      const TARGET = state.volumes.clientVolumes[ volumeID ];

      let newVolume =
        { name: TARGET.name
        , topology:
          { log   : ZfsUtil.unwrapStripe( TARGET.topology.log )
          , cache : ZfsUtil.unwrapStripe( TARGET.topology.cache )
          , data  : ZfsUtil.unwrapStripe( TARGET.topology.data )
          , spare : ZfsUtil.unwrapStripe( TARGET.topology.spare )
          }
        , type: "zfs"
        , attributes: Object.assign( {}, TARGET.attributes )
        };

      if ( !volumeExistsOnServer( volumeID, state ) ) {
        // The volume only exists on the client, so we cache its UUID in the
        // "attributes" property of the volume we're creating. This lets us
        // reconcile it later on.

        newVolume.attributes.GUI_UUID = volumeID;
      }

      if ( newVolume.name.length === 0 ) {
        console.warn( `Cannot submit ${ volumeID }: It has an empty name.` );
        return;
      }

      if ( newVolume.topology.data.length === 0 ) {
        console.warn( `Cannot submit ${ volumeID }: No data VDEVs.` );
        return;
      }

      MC.submitTask( [ "volume.create", [ newVolume ] ]
                   , ( UUID ) => dispatch( volumeCreateAC( UUID, volumeID ) )
                   );
    }
  }
}

export function intendDestroyVolume ( volumeID ) {
  return ( dispatch, getState ) => {
    const state = getState();
    if ( volumeExists( volumeID, state ) ) {
      dispatch(
        { type: TYPES.INTEND_DESTROY_VOLUME
        , payload: { volumeID }
        }
      );
    }
  }
}

export function cancelDestroyVolume () {
  return { type: TYPES.CANCEL_DESTROY_VOLUME }
}

function volumeDestroyAC ( UUID ) {
  return { type: TYPES.DESTROY_VOLUME_TASK_SUBMIT_REQUEST
         , payload: { UUID }
         }
}

export function confirmDestroyVolume () {
  return ( dispatch, getState ) => {
    const state = getState();


    if ( volumeExists( state.volumes.volumeToDestroy, state ) ) {
      const ALL_VOLUMES =
        Object.assign( {}
                     , state.volumes.serverVolumes
                     , state.volumes.clientVolumes
                     );
      const NAME = ALL_VOLUMES[ state.volumes.volumeToDestroy ].name;
      MC.submitTask( [ "volume.destroy", [ NAME ] ]
                   , ( UUID ) => dispatch( volumeDestroyAC( UUID ) )
                   );
    }
  }
}
