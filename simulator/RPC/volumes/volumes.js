// Volumes RPC Class
// ===================
// Provides RPC functions for the volumes namespace.

"use strict";

import _ from "lodash";
import { EventEmitter } from "events";


class Volumes extends EventEmitter {

  constructor ( ) {
    super();
  }

  destroy ( system, args, callback ) {
    console.log( "volumes.destroy; args:", args );
    var volumeToRemove = _.findIndex( system[ "volumes" ]
                                    , { name: args[0] }
                                    );

    if ( volumeToRemove !== -1 ) {
      console.log( "volumes.destroy; got a volumeToRemove:", volumeToRemove );
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
