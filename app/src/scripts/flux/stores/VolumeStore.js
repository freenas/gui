// VOLUMES STORE
// =============

"use strict";


import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

import DS from "./DisksStore";

var _volumes = {};
var _availableSSDs = new Set();
var _availableHDDs = new Set();
var _selectedSSDs = new Set();
var _selectedHDDs = new Set();
var _pendingVolumeCreateTasks = [];
var _pendingVolumeUpdateTasks = [];
var _pendingVolumeDeleteTasks = [];

class VolumeStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get SSDsAreAvailable () {
    return Boolean( _availableSSDs.size );
  }

  get HDDsAreAvailable () {
    return Boolean( _availableHDDs.size );
  }

  get devicesAreAvailable () {
    return this.SSDsAreAvailable || this.HDDsAreAvailable;
  }

  get availableSSDs () {
    return _.sortBy( Array.from( _availableSSDs ) );
  }

  get availableHDDs () {
    return _.sortBy( Array.from( _availableHDDs ) );
  }

  get availableDevices () {
    let SSDs = Array.from( _availableSSDs );
    let HDDs = Array.from( _availableHDDs );
    return _.sortBy( SSDs.concat( HDDs ) );
  }

  get selectedSSDs () {
    return _.sortBy( Array.from( _selectedSSDs ) );
  }

  get selectedHDDs () {
    return _.sortBy( Array.from( _selectedHDDs ) );
  }

  isDeviceAvailable ( path ) {
    return _availableSSDs.has( path ) || _availableHDDs.has( path );
  }

  listVolumes ( sortKey ) {
    if ( sortKey ) {
      return _.chain( _volumes )
              .values()
              .sortBy( sortKey )
              .value();
    } else {
      return _.values( _volumes );
    }
  }

}

function handleDiskSelect ( disk ) {
  if ( DS.isSSD( disk ) ) {
    _selectedSSDs.add( disk );
  } else {
    _selectedHDDs.add( disk );
  }
}

function handleDiskDeselect ( disk ) {
  if ( DS.isSSD( disk ) ) {
    _selectedSSDs.delete( disk );
  } else {
    _selectedHDDs.delete( disk );
  }
}

// Handler for payloads from Flux Dispatcher
function handlePayload ( payload ) {
  const ACTION = payload.action;
  const eventData = ACTION.eventData;

  switch ( ACTION.type ) {

    case ActionTypes.DISKS_SELECTION_REPLACE:
      _selectedSSDs.clear();
      _selectedHDDs.clear();

      if ( _.isArray( ACTION.disks ) ) {
        ACTION.disks.forEach( handleDiskSelect );
      } else {
        handleDiskSelect( ACTION.disks );
      }

      this.emitChange( "diskSelection" );
      break;

    case ActionTypes.DISKS_SELECTED:
      if ( _.isArray( ACTION.disks ) ) {
        ACTION.disks.forEach( handleDiskSelect );
      } else {
        handleDiskSelect( ACTION.disks );
      }

      this.emitChange( "diskSelection" );
      break;

    case ActionTypes.DISKS_DESELECTED:
      if ( _.isArray( ACTION.disks ) ) {
        ACTION.disks.forEach( handleDiskDeselect );
      } else {
        handleDiskDeselect( ACTION.disks );
      }

      this.emitChange( "diskSelection" );
      break;

    case ActionTypes.RECEIVE_VOLUMES:
      _volumes = ACTION.volumes;
      this.fullUpdateAt = ACTION.timestamp;
      this.emitChange( "volumes" );
      break;

    case ActionTypes.RECEIVE_AVAILABLE_DISKS:
      _availableSSDs.clear();
      _availableHDDs.clear();

      ACTION.disks.forEach( disk => {
        if ( DS.isSSD( disk ) ) {
          _availableSSDs.add( disk );
        } else {
          _availableHDDs.add( disk );
        }
      });

      this.emitChange( "availableDisks" );
      break;

    case ActionTypes.RECEIVE_VOLUME_CREATE_TASK:
      _pendingVolumeCreateTasks.push( ACTION.taskID );
      this.emitChange( "volumeCreateTaskPending" );
      break;

    case ActionTypes.RECEIVE_VOLUME_UPDATE_TASK:
      _pendingVolumeUpdateTasks.push( ACTION.taskID );
      this.emitChange( "volumeUpdateTaskPending" );
      break;

    case ActionTypes.RECEIVE_VOLUME_DELETE_TASK:
      _pendingVolumeDeleteTasks.push( ACTION.taskID );
      this.emitChange( "volumeDeleteTaskPending" );
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      let args = eventData.args;
      if ( args.args.name === "entity-subscriber.volumes.changed" ) {
        if ( args.args.operation === "create" ) {
          _volumes[ args.args.entities[0][ "name" ] ] = _.cloneDeep( args.args.entities[0] );
          this.emitChange( "volumes" );
        } else if ( args.args.operation = "destroy" ) {
          _volumes = _.cloneDeep( args.args.entities[0] );
          this.emitChange( "volumes" );
        }
      }
      break;
  }
}

export default new VolumeStore();
