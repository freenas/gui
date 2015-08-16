// Common Volume-related functions
// ===============================
// Class exporting functions to be used across volume-related middleware
// simulator areas.

"use strict";

import _ from "lodash";

const vdevRedundancy =
  { raidz3 : 3
  , raidz2 : 2
  , raidz1 : 1
  // Do not include mirror; it's variable.
  // Do not include disk; it's meaningless.
  };

class VolumeCommon {

  static getDiskSize ( disks, path ) {
    return _.find( disks, { name: path } )[ "mediasize" ];
  }

  static calculateVolumeSize ( dataVdevs, disks ) {

    var volumeSize = 0;

    for ( let i = 0; i < dataVdevs.length; i++ ) {
      let vdev = dataVdevs[i];
      let vdevSize = 0;
      let smallestDiskSize = Infinity;
      // Disk vdevs have only one disk and no children to iterate over.
      if ( vdev.type === "disk" ) {
        vdevSize = VolumeCommon.getDiskSize( disks, vdev[ "path" ] );
      } else {
        // Search for the smallest disk
        for ( let j = 0; j < vdev[ "children" ].length; j++ ) {
          smallestDiskSize = Infinity;
          let diskSize = VolumeCommon.getDiskSize( disks
                                     , vdev[ "children" ][ j ][ "path" ]
                                     )

          smallestDiskSize = diskSize < smallestDiskSize
                           ? diskSize
                           : smallestDiskSize;
        }
          // The size of a mirror vdev is always the size of its smallest
          // component disk.
        if ( vdev[ "type" ] === "mirror" ) {
          vdevSize = smallestDiskSize;
        } else {
          // Add the smallest disk size to the vdev size for each disk
          // over the vdev redundancy level.
          let disksThatCount = vdev[ "children" ].length
                             - vdevRedundancy[ vdev[ "type" ] ];
          for ( let k = 0; k < disksThatCount; k++ ) {
            vdevSize += smallestDiskSize;
            console.log( "smallestDiskSize:", smallestDiskSize );
          }
        }
      }
    volumeSize += vdevSize;
    }

    return volumeSize;

  }
}

export default VolumeCommon;
