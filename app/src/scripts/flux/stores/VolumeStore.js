// VOLUMES STORE
// =============

"use strict";


import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

import DS from "./DisksStore";

// DATASET NAME BLACKLIST
// This set represents all of the strings and regexps that should be blacklisted
// by the GUI in most situations
const DATASET_NAME_BLACKLIST = new Set(
  [ "iocage"
  , /^\./
  ]
);

var _volumes = {};
var _availableSSDs = new Set();
var _availableHDDs = new Set();
var _selectedSSDs = new Set();
var _selectedHDDs = new Set();
var _pendingVolumeCreateTasks = [];
var _pendingVolumeUpdateTasks = [];
var _pendingVolumeDestroyTasks = [];

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


  isDatasetNamePermitted ( name ) {
    if ( DATASET_NAME_BLACKLIST.has( name ) ) {
      // Take advantage of Set string matching capabilities to short circuit
      // non-regexp matches
      return false;
    }

    for ( let entry of DATASET_NAME_BLACKLIST ) {
      // Iterate over the RegExps in the blacklist, and try to match them
      // with the supplied `name` argument
      if ( entry instanceof RegExp && name.match( entry ) ) {
        return false;
      }
    }

    // The string literal was not matched, and none of the RegExp rules
    // triggered a match: The name is not blacklisted
    return true;
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

function nestDatasets ( datasets ) {
  if ( !datasets ) {
    // Datasets was definitely not an array
    console.warn( "Expected `datasets` to be an array" );
    return [];
  }

  switch ( datasets.length ) {
    case 0:
      // There are no datasets, return early.
      return [];

    case 1:
      // The only dataset is the root datset, return early.
      return datasets;

    default:
      let poolName;
      let hash  = _.indexBy( datasets, "name" );
      let names = _.pluck( datasets, "name" );

      _.sortBy( names, ( name ) => {
          // Create sorted list of dataset names in accordance of their path
          // lengths, starting with the longest (most nested) paths.
          let slashes = name.match( /\//gi );
          return ( slashes
                 ? ( -1 * slashes.length )
                 : 0
                 );
        })
       .forEach( ( name, index ) => {
          let parentPath = name.replace( /(\/[^\/]*$)/i, "" );

          if ( parentPath === name ) {
            poolName = name;
          } else {
            if ( hash[ parentPath ].children ) {
              hash[ parentPath ].children.push( hash[ name ] );
            } else {
              hash[ parentPath ].children = [ hash[ name ] ];
            }
          }
        });

      return [ hash[ poolName ] ];
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
      _volumes = {};
      ACTION.volumes.forEach( ( volume ) => {
          volume.datasets = nestDatasets( volume.datasets );
          _volumes[ volume.id ] = volume;
        }
      );
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

    case ActionTypes.RECEIVE_VOLUME_DESTROY_TASK:
      _pendingVolumeDestroyTasks.push( ACTION.taskID );
      this.emitChange( "volumeDestroyTaskPending" );
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      handleMiddlewareEvent.call( this, payload );
      break;
  }
}

function handleMiddlewareEvent ( payload ) {
  const args = payload.action.eventData.args;

  switch ( args.name ) {
    case "entity-subscriber.volumes.changed":
      if ( args.args.operation === "create" ) {
        _volumes[ args.args.entities[0].id ] = _.cloneDeep( args.args.entities[0] );
        this.emitChange( "volumeCreated" );
      } else if ( args.args.operation = "destroy" ) {
        delete _volumes[ args.args.ids[0] ];
        this.emitChange( "volumeDestroyed" );
      }
      break;
    case "task.progress":
      switch ( args.args.name ) {
        case "volume.create":
          if ( args.args.state === "FINISHED" ) {
            _.pull( _pendingVolumeCreateTasks
                  , args.args.id
                  );
            this.emitChange( "createVolumeTaskFinished" );
          }
          break;
        case "volume.update":
          if ( args.args.state === "FINISHED" ) {
            _.pull( _pendingVolumeUpdateTasks
                  , args.args.id
                  );
            this.emitChange( "updateVolumeTaskFinished" );
          }
          break;
        case "volume.destroy":
          if ( args.args.state === "FINISHED" ) {
            _.pull( _pendingVolumeDestroyTasks
                  , args.args.id
                  );
            this.emitChange( "destroyVolumeTaskFinished" );
          }
          break;
      }
  }
}

export default new VolumeStore();
