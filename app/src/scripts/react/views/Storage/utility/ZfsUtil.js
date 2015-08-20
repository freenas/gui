// ZFS UTIL
// ========
// Utility class containing helper methods for various different ZFS concerns.
// Prefer adding methods to this class over marooning them in various different
// React components.

"use strict";

import _ from "lodash";

import DS from "../../../../flux/stores/DisksStore";

const VDEV_TYPES =
  { data: [ "disk", "stripe", "mirror", "raidz1", "raidz2", "raidz3" ]
  , logs: [ "disk", "stripe", "mirror" ]
  , cache: [ "disk", "stripe", "mirror" ]
  , spares: [ "disk", "stripe" ]
};

const DISK_CHUNKS =
  { mirror:
      { speed: 2
      , safety: 2
      , storage: 2
      }
  , raidz1:
      { speed: 7
      , safety: 7
      , storage: 7
      }
  , raidz2:
      { speed: 7
      , safety: 7
      , storage: 7
      }
  };

class ZfsUtil {

  static getMemberDiskPaths( collection ) {
    let paths = [];

    if ( collection ) {
      if ( collection.type === "disk" ) {
        paths.push( collection.path );
      } else {
        paths = _.pluck( collection.children, "path" );
      }
    }

    return paths;
  }

  static caluclateBreakdown ( collection ) {
    let breakdown =
      { parity : 0
      , avail  : 0
      };

    collection.forEach( vdev => {
      if ( vdev.type ) {
        let smallestDisk = DS.getSmallestDisk(
          this.getMemberDiskPaths( vdev )
        );

        let baseSize = _.has( smallestDisk, "mediasize" )
                     ? smallestDisk.mediasize
                     : 0;

        switch ( vdev.type ) {
          case "disk":
            breakdown.parity += 0;
            breakdown.avail  += baseSize;
            break;

          case "stripe":
            breakdown.parity += 0;
            breakdown.avail  += baseSize * vdev.children.length;
            break;

          case "mirror":
            breakdown.parity += baseSize * ( vdev.children.length - 1 );
            breakdown.avail  += baseSize;
            break;

          case "raidz1":
            breakdown.parity += baseSize * 1;
            breakdown.avail  += ( baseSize * vdev.children.length )
                              - breakdown.parity;
            break;

          case "raidz2":
            breakdown.parity += baseSize * 2;
            breakdown.avail  += ( baseSize * vdev.children.length )
                              - breakdown.parity;
            break;

          case "raidz3":
            breakdown.parity += baseSize * 3;
            breakdown.avail  += ( baseSize * vdev.children.length )
                              - breakdown.parity;
            break;
        }
      }
    });

    return breakdown;
  }

  static createNewDisk ( path ) {
    return ( { path: path
             , type: "disk"
             , children: []
             }
    );
  }

  static reconstructVdev ( key, purpose, purposeVdevs, disks = [], allAllowedTypes, currentType = null ) {
    let vdevAllowedTypes = [];
    let newVdev;
    let newType;

    if ( disks.length === 1 ) {
      vdevAllowedTypes.push( VDEV_TYPES[ purpose ][0] );
      newVdev = this.createNewDisk( disks[0] );
    } else if ( disks.length > 1 ) {
      // This might look "too clever" at first, but it's very simple. The
      // VDEV_TYPES array contains 5 entries, from "disks" to "raidz3". To
      // have three parity drives for a VDEV, you need to have two data disks.
      // If you only have one, then what you actually have is a four-way
      // mirror. This holds true for Z2 and Z1, all the way down to the case
      // where you have two disks, and your only option is to mirror or stripe
      // them (but striping is bad and we might want to not allow it in
      // certain "purposes", like data ). We add one to the length of the
      // array to accommodate both "stripe" and "mirror".
      if ( VDEV_TYPES[ purpose ].length > 1 ) {
        vdevAllowedTypes.push(
          ...VDEV_TYPES[ purpose ].slice( 1, disks.length + 1 )
        );
      } else {
        vdevAllowedTypes.push( VDEV_TYPES[ purpose ][0] );
      }

      if ( currentType ) {
        let typeIndex = VDEV_TYPES[ purpose ].indexOf( currentType );
        let allowedIndex = vdevAllowedTypes.indexOf( currentType );

        if ( typeIndex > ( vdevAllowedTypes.length - 1 ) ) {
          // The user has selected a type, but the number of disks available
          // now no longer supports that option. We should, then, select the
          // *next* highest possible option: Z2 to Z1, Z1 to mirror, etc.
          newType = _.last( vdevAllowedTypes );
        } else if ( allowedIndex > -1 ) {
          // The user has indicated a desire for this VDEV to be a certain
          // type, and we have found that type in the array of allowed values.
          // This is the simplest outcome: The user retains their selection.
          newType = currentType;
        }
      }

      if ( !newType ) {
        // The only case in which a user could have a lower selection index
        // is when transitioning from "disk" to something else, or else the
        // user has not selected a type. We can select the first available
        // option in this case. This will have the effect of selecting the
        // first available type for two disks, usually "stripe".
        newType = vdevAllowedTypes[0];
      }

      newVdev =
        { path     : null
        , type     : newType
        , children : _.sortBy( disks ).map( this.createNewDisk )
        };
    }

    if ( newVdev ) {
      // One of the above conditions resulted in the creation of a VDEV,
      // potentially including the "empty" VDEV that lives at the end of each
      // bucket.
      purposeVdevs[ key ] = newVdev;
      allAllowedTypes[ purpose ][ key ] = vdevAllowedTypes;
    } else {
      // The alternate outcome is that we have an empty VDEV somewhere in the
      // middle of the bucket - probably because the user removed its disks
      purposeVdevs.splice( key, 1 );
      allAllowedTypes[ purpose ].splice( key, 1 );
    }

    // These values should be used by this.setState in a React component
    return (
      { [ purpose ]: purposeVdevs
      , allowedTypes: allAllowedTypes
      }
    );
  }

  static createTopology ( ssds, disks, preferences ) {
    let topology =
      { data: []
      , logs: []
      , cache: []
      , spares: []
      , allowedTypes: _.cloneDeep( VDEV_TYPES )
      };

    // HAHA THIS IS DUMB DEAL WITH IT
    // AIRHORN.MP3

    let availableHDDs = _.difference( disks, ssds );
    let ssdSplit = Math.floor( ssds.length / 2 );
    let logsSsds = ssds.slice( 0, ssdSplit );
    let cacheSsds = ssds.slice( ssdSplit, ssds.length );
    let desired = preferences.desired[0].toLowerCase();
    let chunkSize = DISK_CHUNKS[ desired ][ preferences.priority.toLowerCase() ];

    topology.logs =
      this.reconstructVdev( 0
                          , "logs"
                          , []
                          , logsSsds
                          , topology.allowedTypes
                          , "stripe"
                          )["logs"];
    topology.cache =
      this.reconstructVdev( 0
                          , "cache"
                          , []
                          , cacheSsds
                          , topology.allowedTypes
                          , "stripe"
                          )["cache"];


    _.chunk( availableHDDs, chunkSize ).forEach( ( chunkDisks, index ) => {
      if ( chunkDisks.length === chunkSize ) {
        topology.data =
          this.reconstructVdev( index
                              , "data"
                              , topology.data
                              , chunkDisks
                              , topology.allowedTypes
                              , desired
                              )["data"];
      }
    });

    return topology;
  }


  static wrapStripe () {
    // TODO
  }

  static unwrapStripe ( vdevs ) {
    // Because "stripe" is not an officialy recognized ZFS property, we
    // approximate it in the FreeNAS GUI. What must actually be sent to ZFS
    // is a flattened array of "disk" VDEVs at the top level, which will
    // automatically be striped together.

    if ( _.isArray( vdevs ) ) {
      let unwrapped = [];

      vdevs.forEach( vdev => {
        if ( vdev.type === "stripe" ) {
          unwrapped.push( ...vdev.children );
        } else {
          unwrapped.push( vdev );
        }
      });

      return unwrapped;
    } else {
      return null;
    }
  }

}

export default ZfsUtil;
