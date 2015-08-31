// Volumes RPC Class
// ===================
// Provides RPC functions for the volumes namespace.

"use strict";

import _ from "lodash";
import moment from "moment";

import RPCBase from "../RPC_BASE_CLASS";
import VolumeCommon from "../../templates/VolumeCommon";

const time = moment().unix();

const volumeDefaults = require( "../../templates/volumeDefaults.json" );
const datasetDefaults = require( "../../templates/datasetDefaults.json" );
const vDevGUIDStarter = 2866253151434971358;
const datasetGUIDStarter = 5133185099967636567;

function getUsedDiskPaths ( vdev ) {
  var usedDiskPaths = [];

  if ( vdev[ "type" ] === "disk" ) {
    usedDiskPaths.push( vdev[ "path" ] );
  } else {
    for ( let i = 0; i < vdev[ "children" ].length; i++ ) {
      usedDiskPaths.push( vdev[ "children" ][ i ][ "path" ] );
    }
  }
  return usedDiskPaths;
}

function processNewVolume ( volume, system ) {
  var newVolume = {};
  var volumeSettings = volume[ "settings" ] || null;

  var size = VolumeCommon.calculateVolumeSize( volume[ "topology" ][ "data" ]
                                             , system[ "disks" ]
                                             );

  var rootDataset =
    { name:
      { source: "NONE"
      , value: volume[ "name" ]
      }
    , properties:
      { available:
        { source: "NONE"
        , value: size
        }
      , name:
        { source: "NONE"
        , value: volume[ "name" ]
        }
      , creation:
        { source: "NONE"
        , value: time
        }
      }
    };

  _.defaultsDeep( rootDataset, datasetDefaults)

  if ( volumeSettings ) {
    // For dedup, just a truthy value is needed.
    if ( volumeSettings[ "dedup" ] ) {
      rootDataset[ "properties" ][ "dedup" ] =
        { source: "LOCAL"
        , value: "on"
        }
    }
    // For compression, set the desired compression algorithm. The default is
    // lz4.
    if ( volumeSettings[ "compression" ] ) {
      rootDataset[ "properties" ][ "compression" ] =
        { source: "LOCAL"
        , volue: volumeSettings[ "compression" ]
        }
    }
  }

  let datasets = [ rootDataset ];

  newVolume =
    { name: volume[ "name" ]
    , mountpoint: "/volumes/" + volume[ "name" ]
    , topology: volume[ "topology" ]
    , properties:
      { free:
        { source: "NONE"
        , value: size
        }
      , name:
        { source: "NONE"
        , value: volume[ "name" ]
        }
      , size:
        { source: "NONE"
        , value: size
        }
      }
    , root_dataset: rootDataset
    , datasets: datasets
    , "updated-at": time
    , "created-at" : time
    };

  _.defaultsDeep( newVolume, volumeDefaults );

  return newVolume;

}

class Volumes extends RPCBase {

  constructor () {
    super();

    this.namespace = "volumes";
    this.CHANGE_EVENT = "volumes.changed";
    this.TASK_EVENT = "volumes";
  }

  create ( system, args, callback ) {

    var newSystem = _.cloneDeep( system );
    const timeout = 5000 // Delay in dispatching completion events

    if ( _.has( newSystem[ "volumes" ], args[0][ "name" ] ) ) {
      console.log( "dupe name" );
    }

    var newVolume = processNewVolume( args[0], newSystem );

    newSystem.volumes[ newVolume[ "name" ] ] = newVolume;

    callback( newSystem, newSystem[ "volumes" ] );
    this.emitChange( "volumes.changed"
                   , "volume.create"
                   , _.cloneDeep( newVolume )
                   , timeout
                   );

    this.emitTask( "volumes"
                 , "volume.create"
                 , timeout // time the task should take before dispatch
                 , "root" // task owner
                 , args[0] // original arguments
                 , _.cloneDeep( newVolume )
                 , true // task succeeds
                 );
    // TODO: error checking

  }

  destroy ( system, args, callback ) {

    var newSystem = _.cloneDeep( system );

    if ( _.has ( newSystem[ "volumes" ], [ args[0] ] ) ) {
      delete newSystem[ "volumes" ][ args[0] ];
      callback( newSystem, newSystem[ "volumes" ] );
      this.emitChange( "volumes.changed"
                     , "volume.destroy"
                     , _.cloneDeep( newSystem[ "volumes" ] )
                     );
    } else {
      // TODO: Emit error
    }

  }

  get_available_disks ( system ) {
    var availableDisks = [];
    const volumes = _.values( system[ "volumes" ] );

    // Make a list of the paths to all disks
    var availableDisks =
      _.map( system[ "disks" ]
           , function mapAvailableDiskPaths ( disk ) {
             return disk[ "name" ];
           }
           );
    // Iterate over volumes
    for ( let i = 0; i < volumes.length; i++ ) {
      let topology = _.values( volumes[i].topology );
      // Iterate over disk, spare, cache, and log in each volume
      for ( let j = 0; j < topology.length; j++ ) {
        let vdevType = topology[j];
        // Iterate over the vdevs in each vdev of that vdev type
        for ( let k = 0; k < vdevType.length; k++ ) {
          // Check the disk paths in each vdev and remove them from circulation
          let vdev = vdevType[k];
          let usedDisks = getUsedDiskPaths( vdev );
          _.pull( availableDisks
                , ...usedDisks
                );
        }
      }
    }

    return availableDisks;

  }

  query ( system ) {
    return system[ "volumes" ];
  }

}


export default Volumes;
