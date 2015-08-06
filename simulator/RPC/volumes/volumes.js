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
const volumeIDStarter = 2950145407967379177;

function processNewVolume ( volume, system ) {
  var newVolume = volumeDefaults;

  let size = VolumeCommon.calculateVolumeSize( volume[ "topology" ][ "data" ]
                                             , system[ "disks" ]
                                             );

  var rootDataset = datasetDefaults;

  _.merge( rootDataset
         , { name:
             { source: "NONE"
             , value: volume[ "name" ]
             }
           , properties:
             { available:
               { source: "NONE"
               , value: size.toString()
               }
             , name:
               { source: "NONE"
               , value: volume[ "name" ]
               }
             , creation:
               { source: "NONE"
               , value: time.toString()
               }
             }
           }
         );

  let datasets = [ rootDataset ];

  _.merge( newVolume
         , { id: volumeIDStarter + system[ "volumes" ].length
           , name: volume[ "name" ]
           , mountpoint: "/volumes/" + volume[ "name" ]
           , topology: volume[ "topology" ]
           , properties:
             { free:
               { source: "NONE"
               , value: size.toString()
               }
             , name:
               { source: "NONE"
               , value: volume[ "name" ]
               }
             }
           , root_dataset: rootDataset
           , datasets: datasets
           , "updated-at": time.toString()
           , "created-at" : time.toString()
           }
         );

  return newVolume;

}

class Volumes extends RPCBase {

  constructor () {
    super();
  }

  create ( system, args, callback ) {

    var newVolume = processNewVolume( args[0], system );

    system.volumes.push( newVolume );

    callback( system, system[ "volumes" ] );

    // TODO: emit event

    // TODO: error checking

  }

  destroy ( system, args, callback ) {

    var volumeToRemove = _.findIndex( system[ "volumes" ]
                                    , { name: args[0] }
                                    );

    if ( volumeToRemove !== -1 ) {

      _.pullAt( system[ "volumes" ]
              , [ volumeToRemove ]
              );
      callback( system, system[ "volumes" ] );
      // TODO: Emit event
    } else {
      // TODO: Emit error
    }

  }

  getUsedDiskPaths ( vdev ) {
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

  get_available_disks ( system ) {
    var availableDisks = [];
    const volumes = system[ "volumes" ];

    // Make a list of the paths to all disks
    var availableDisks =
      _.map( system[ "disks" ]
           , function mapAvailableDiskPaths ( disk ) {
             return disk[ "name" ];
           }
           );
    // Iterate over volumes
    for ( let i = 0; i < volumes.length; i++ ) {
      // Iterate over disk, spare, cache, and log in each volume
      _.forEach( volumes[i].topology
               , function mapUsedDisksOverTopology ( vdevType ) {
                 // Iterate over all the vdevs of a particular type
                 _.forEach( vdevType
                          , function removeUsedDisksByVdev ( vdev ) {
                            // Remove all the disks in a vdev from the list of
                            // available disks.
                            _.pull( availableDisks
                                  , this.getUsedDiskPaths( vdev )
                                  );
                          }
                          , this
                          );
               }
               , this
               );
    }

    return availableDisks;

  }

  query ( system ) {
    return system[ "volumes" ];
  }

}


export default Volumes;
