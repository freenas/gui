// Volumes Generator
// =================
// Generates plausible volumes for use in simulated machines, using the virtual
// disks provided.

"use strict";

import _ from "lodash";
import moment from "moment";

import VolumeCommon from "./VolumeCommon";

const time = moment().unix();

const volumeDefaults = require( "./volumeDefaults.json" );
const datasetDefaults = require( "./datasetDefaults.json" );

const nameStarter = "tank";

const vDevGUIDStarter = 2866253151434971358;

const datasetGUIDStarter = 5133185099967636567;

const volumeIDStarter = 2950145407967379177;

// Feel free to mess with these numbers to change what number of disks the
// volume maker will use to decide what kind of vdev to make.
const vdevDiskCounts =
  { raidz3 : 5 // Keep five or greater
  , raidz2 : 4 // Keep four or greater
  , raidz1 : 3 // Keep three or greater
  , mirror : 2 // Keep two or greater
  , disk   : 1 // Do not change
  };

// Creates vdevs of 'type' using 'disks'.
function createVdevs ( type, disks ) {
  var newVdevs = [];
  var newVdev;
  var children;

  var i;
  var j;

  // Loop over the disks in chunks the size of the vdev size.
  for ( i = 0; i < disks.length; i += vdevDiskCounts[ type ] ) {
    children = [];
    // Once you're in the appropriate chunk of disks, distribute them into
    // the proper groups (a vdev for disks, 'children' otherwise).
    for ( j = i; j < vdevDiskCounts[ type ] + i; j++ ) {
      // Disks are different, because they are all top-level vdevs.
      if ( type === "disk" ) {
        newVdev =
          { status: "ONLINE"
          , path: disks[j][ "name" ]
          , type: "disk"
          , guid: vDevGUIDStarter + i
          , children: []
          };
      } else {
        children.push(
          { status: "ONLINE"
          , path: disks[j][ "name" ]
          , type: "disk"
          , guid: vDevGUIDStarter + j + disks.length
          , children: []
          }
        );
      }
    }
    // This should only execute if 'children' was populated in the loop above.
    if ( !_.isEmpty( children ) ) {
      newVdev =
        { status: "ONLINE"
        , path: null
        , children: children
        , type: type
        , guid: vDevGUIDStarter + i
        };
    }
    newVdevs.push( newVdev );
  }
  return newVdevs;
}

// Creates a volume called 'name' from the given 'disks'.
// If any of the disks are ssds, they'll be put in log or cache vdevs.
// Where possible, it will try to even out the number of disks to make
// symmetrical vdevs. Extra disks may become spares.
function createVolume ( volumeIndex, disks, id ) {

  var newVolume = volumeDefaults;
  var topology;
  var newVdev;
  var datasets = [];
  var startingDataset = {};
  var startingDatasetSize = 0;
  var volumeSize;
  var name = nameStarter + volumeIndex;

  var ssds = [];
  var hdds = [];

  var cache = [];
  var log = [];
  var data = [];
  var spares = [];

  var i;
  var j;

  // We will represent volume size in bytes.
  var size = 0;

  // Separate out hdds and ssds
  _.forEach( disks
           , function selectSSDs ( disk ) {
             if ( disk[ "is-ssd" ] ) {
               ssds.push( disk );
             } else {
               hdds.push( disk );
             }
           }
  );

  // Put every other ssd in cache or vdev
  for ( i = 0; i < ssds.length; i++ ) {
    if ( i % 2 ) {
      cache.push( ssds[i] );
    } else {
      log.push( ssds[i] );
    }
  }

  // Construct data vdevs from the remaining disks.
  do {
    // If there's only one disk, you're just getting a disk vdev.
    if ( hdds.length === vdevDiskCounts[ "disk" ] ) {
      data = createVdevs( "disk", hdds );
    // Check divisibility by the other vdev sizes to determin vdev type.
    } else if ( hdds.length % vdevDiskCounts[ "raidz3" ] === 0 ) {
      data = createVdevs( "raidz3", hdds );
    } else if ( hdds.length % vdevDiskCounts[ "raidz2" ] === 0 ) {
      data = createVdevs( "raidz2", hdds );
    } else if ( hdds.length % vdevDiskCounts[ "raidz1" ] === 0 ) {
      data = createVdevs( "raidz1", hdds );
    } else if ( hdds.length % vdevDiskCounts[ "mirror" ] === 0 ) {
      data = createVdevs( "mirror", hdds );
    // If the number of disks isn't divisible by any of the above, make one
    // into a spare. This will happen until there's an appropriate vdev number.
    } else {
      spares = createVdevs( "disk", hdds.pop() );
    }
  } while ( data.length === 0 );

  topology =
  { cache: cache
  , log: log
  , data: data
  , spares: spares
  };

  volumeSize = VolumeCommon.calculateVolumeSize( topology[ "data" ], disks );

  // Change this to remove the default stuff ZFS creates.
  startingDatasetSize = volumeSize;

  startingDataset =
    { name:
      { source: "NONE"
      , value: name
      }
    , mountpoint:
      { source: "LOCAL"
      , value: "/volumes/" + name
      }
    , properties:
      { available:
        { source: "NONE"
        , value: startingDatasetSize
        }
      , name:
        { source: "NONE"
        , value: name
        }
      , creation:
        { source: "NONE"
        , value: time
        }
      }
    };

  startingDataset = _.merge( startingDataset, datasetDefaults );

  datasets.push( startingDataset );

  _.merge( newVolume
         , { datasets: datasets
           , mountpoint: "/volumes/" + name
           , topology: topology
           , id: id
           , name: name
           , "updated-at": time
           , "created-at" : time
           , properties:
             { free:
               { source: "NONE"
               , value: volumeSize
               }
              , name:
               { source: "NONE"
               , value: name
               }
             }
           }
         );

  return newVolume;
}

// Creates 'config[ "volumeCount" ]' volumes, using
// 'config[ "volumeDiskCount" ]' disks from 'disks'.
function createVolumes ( config, disks ) {

  var newVolumes = [];

  var volumeDisks = [];

  for ( let i = 0; i < config[ "volumeCount" ]; i++ ) {
    let nextVolume = {};

    // name = nameStarter + i;
    // console.log( "createVolumes, name:", name );
    let id = volumeIDStarter + i;

    volumeDisks = disks.splice( 0, config[ "volumeDiskCount" ] );

    nextVolume = createVolume( i, volumeDisks, id );

    newVolumes.push( _.cloneDeep( nextVolume ) );
  }

  return newVolumes;
}

module.exports = createVolumes;
