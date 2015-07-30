// Volumes RPC Class
// ===================
// Provides RPC functions for the volumes namespace.

"use strict";

import _ from "lodash";


class Volumes {

  static getUsedDiskPaths ( vdev ) {
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

  static get_available_disks ( system ) {
    var availableDisks = [];
    var volumes = system[ "volumes" ];

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
                                  , Volumes.getUsedDiskPaths( vdev )
                                  );
                          }
                          );
               }
               );
    }

    return availableDisks;

  }

  static query ( system ) {
    return system[ "volumes" ];
  }
}


export default Volumes;
