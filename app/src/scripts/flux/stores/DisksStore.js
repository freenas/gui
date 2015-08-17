// DISKS STORE
// ===========
// Store information about the physical storage devices connected to the FreeNAS
// server, their S.M.A.R.T. status (if available), but not the activity level or
// other highly specific information about the individual components.

"use strict";

import _ from "lodash";

import DebugLogger from "../../utility/DebugLogger";
import ByteCalc from "../../utility/ByteCalc";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

const DL = new DebugLogger( "DISKS_STORE_DEBUG" );

const DISK_LABELS =
  { serial: "Serial"
  , humanSize: "Capacity"
  , online: "Disk Online"
  , path: "Path"
  , sectorsize: "Sector Size"
  , "max-rotation": "Maximum RPM"
  , "smart-enabled": "S.M.A.R.T. Enabled"
  , "smart-status": "S.M.A.R.T. Status"
  , model: "Disk Model"
  , schema: "Partition Format"
  };

var _disks = {};

class DisksStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );

    this.KEY_UNIQUE = "serial";
    this.ITEM_LABELS = DISK_LABELS;
  }

  get disksArray () {
    return (
      _.chain( _disks )
       .values()
       .sortBy( "path" )
       .value()
    );
  }

  get similarDisks () {
    // Returns arrays of disks based on their self-similarity - determined as
    // the combination of RPM, capacity, type, and manufacturer.
    let disks = _.partition( _disks, disk => disk.status["is-ssd"] );
    let SSDs = {};
    let HDDs = {};

    function createLabel ( disk ) {
      return (
        [ disk.status.manufacturer
        , ByteCalc.humanize( disk.mediasize, { roundMode: "whole" } )
        , disk.status["is-ssd"]
          ? ""
          : disk.status["max-rotation"] + "rpm"
        ].join( " " )
      );
    }

    // SSDs
    _.chain( disks[0] )
      .sortBy( "path" )
      .value()
      .map( disk => {
        let label = createLabel( disk );

        if ( _.isArray( SSDs[ label ] ) ) {
          SSDs[ label ].push( disk.path );
        } else {
          SSDs[ label ] = [ disk.path ];
        }
      });

    // HDDs
    _.chain( disks[1] )
      .sortBy( "path" )
      .value()
      .map( disk => {
        let label = createLabel( disk );

        if ( _.isArray( HDDs[ label ] ) ) {
          HDDs[ label ].push( disk.path );
        } else {
          HDDs[ label ] = [ disk.path ];
        }
      });

    return [ SSDs, HDDs ];
  }

  getByPath ( path ) {
    if ( _.isArray( path ) ) {
      let collection = [];

      for ( let i = 0; i < path.length; i++ ) {
        let workingDisk = _.findWhere( _disks, { path: path[i] } );
        if ( workingDisk ) {
          collection.push( workingDisk );
        }
      }

      return collection;
    } else {
      return _.findWhere( _disks, { path: path } );
    }
  }

  isSSD ( path ) {
    let targetDisk = this.getByPath( path );

    return targetDisk
      ? targetDisk.status["is-ssd"]
      : null;
  }

  isHDD ( path ) {
    let targetDisk = this.getByPath( path );

    return targetDisk
      ? !targetDisk.status["is-ssd"]
      : null;
  }

  getBiggestDisk ( path ) {
    if ( this.isInitialized ) {
      return _.chain( this.getByPath( path ) )
              .sortBy( "mediasize" )
              .last()
              .value();
    } else {
      if ( DL.reports( "stores" ) ) {
        DL.warn( "Cannot call method 'getBiggestDisk': DisksStore not "
               + "initialized"
               );
      }
      return null;
    }
  }

  getSmallestDisk ( path ) {
    if ( this.isInitialized ) {
      return _.chain( this.getByPath( path ) )
              .sortBy( "mediasize" )
              .first()
              .value();
    } else {
      if ( DL.reports( "stores" ) ) {
        DL.warn( "Cannot call method 'getSmallestDisk': DisksStore not "
               + "initialized"
               );
      }
      return null;
    }
  }

}

function getCalculatedDiskProps ( disk ) {
  let calculatedProps = {};

  if ( disk.hasOwnProperty( "mediasize" ) ) {
    calculatedProps.humanSize = ByteCalc.humanize( disk.mediasize );
    // FIXME: TEMPORARY WORKAROUND
    calculatedProps.driveName = calculatedProps.humanSize + " Drive";
  }

  return calculatedProps;
}

function handlePayload ( payload ) {
  const ACTION = payload.action;
  const eventData = ACTION.eventData;

  switch ( ACTION.type ) {

    case ActionTypes.RECEIVE_DISKS_OVERVIEW:
      let newDisks = {};

      ACTION.disksOverview.forEach(
        function iterateDisks ( disk ) {
          newDisks[ disk[ this.KEY_UNIQUE ] ] =
            _.merge( getCalculatedDiskProps( disk ), disk );
        }.bind( this )
      );

      _.merge( _disks, newDisks );
      this.fullUpdateAt = ACTION.timestamp;
      this.emitChange();
      break;

    case ActionTypes.RECEIVE_DISK_DETAILS:
      if ( _disks.hasOwnProperty( ACTION.diskDetails[ this.KEY_UNIQUE ] ) ) {
        // This disk has already been instantiated, and we should atttempt to
        // patch new information on top of it
        _.merge( _disks[ this.KEY_UNIQUE ], ACTION.diskDetails );
      } else {
        // There is no current record for a disk with this identifier, so this
        // will be the initial data.
        _disks[ ACTION.diskDetails[ this.KEY_UNIQUE ] ] = ACTION.diskDetails;
      }
      this.emitChange();
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      let args = eventData.args;
      if ( args.name === "disks.update" ) {
        _disks[ args.args.entities[0][ this.KEY_UNIQUE ] ] = _.cloneDeep( args.args.entities[0] );
        this.emitChange();
      }
      break;
  }
}

export default new DisksStore();
