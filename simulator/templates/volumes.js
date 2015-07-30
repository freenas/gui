// Volumes Generator
// =================
// Generates plausible volumes for use in simulated machines, using the virtual
// disks provided.

"use strict";

var _ = require( "lodash" );
var moment = require( "moment" );

var time = moment().unix();

var datasetDefaults =
  { properties:
    { origin:
      { source: null
      , value: null
      }
    , referenced:
      { source: "NONE"
      , value: "96000"
      }
    , numclones:
      { source: null
      , value: null
      }
    , primarycache:
      { source: "DEFAULT"
      , value: "all"
      }
    , logbias:
      { source: "DEFAULT"
      , value: "latency"
      }
    , inconsistent:
      { source: "NONE"
      , value: "0"
      }
    , reservation:
      { source: "DEFAULT"
      , value: "none"
      }
    , casesensitivity:
      { source: "NONE"
      , value: "sensitive"
      }
    , usedbysnapshots:
      { source: "NONE"
      , value: "0"
      }
    , stmf_sbd_lu:
      { source: null
      , value: null
      }
    , mounted:
      { source: "NONE"
      , value: "yes"
      }
    , compression:
      { source: "LOCAL"
      , value: "lz4"
      }
    , snapdir:
      { source: "DEFAULT"
      , value: "hidden"
      }
    , copies:
      { source: "DEFAULT"
      , value: "1"
      }
    , aclinherit:
      { source: "LOCAL"
      , value: "passthrough"
      }
    , compressratio:
      { source: "NONE"
      , value: "1.00x"
      }
    , recordsize:
      { source: "DEFAULT"
      , value: "128000"
      }
    , mlslabel:
      { source: "NONE"
      , value: ""
      }
    , jailed:
      { source: "DEFAULT"
      , value: "off"
      }
    , snapshot_count:
      { source: "DEFAULT"
      , value: "none"
      }
    , volsize:
      { source: null
      , value: null
      }
    , clones:
      { source: null
      , value: null
      }
    , atime:
      { source: "DEFAULT"
      , value: "on"
      }
    , usedbychildren:
      { source: "NONE"
      , value: "156000"
      }
    , volblocksize:
      { source: null
      , value: null
      }
    , objsetid:
      { source: "NONE"
      , value: "21"
      }
    , defer_destroy:
      { source: null
      , value: null
      }
    , type:
      { source: "NONE"
      , value: "filesystem"
      }
    , devices:
      { source: "DEFAULT"
      , value: "on"
      }
    , useraccounting:
      { source: "NONE"
      , value: "1"
      }
    , iscsioptions:
      { source: null
      , value: null
      }
    , setuid:
      { source: "DEFAULT"
      , value: "on"
      }
    , usedbyrefreservation:
      { source: "NONE"
      , value: "0"
      }
    , logicalused:
      { source: "NONE"
      , value: "25.5000"
      }
    , userrefs:
      { source: null
      , value: null
      }
    , creation:
      { source: "NONE"
      , value: time
      }
    , sync:
      { source: "DEFAULT"
      , value: "standard"
      }
    , volmode:
      { source: "DEFAULT"
      , value: "default"
      }
    , sharenfs:
      { source: "DEFAULT"
      , value: "off"
      }
    , sharesmb:
      { source: "DEFAULT"
      , value: "off"
      }
    , createtxg:
      { source: "NONE"
      , value: "1"
      }
    , xattr:
      { source: "TEMPORARY"
      , value: "off"
      }
    , utf8only:
      { source: "NONE"
      , value: "off"
      }
    , aclmode:
      { source: "LOCAL"
      , value: "passthrough"
      }
    , exec:
      { source: "DEFAULT"
      , value: "on"
      }
    , dedup:
      { source: "DEFAULT"
      , value: "off"
      }
    , snapshot_limit:
      { source: "DEFAULT"
      , value: "none"
      }
    , readonly:
      { source: "DEFAULT"
      , value: "off"
      }
    , version:
      { source: "NONE"
      , value: "5"
      }
    , filesystem_limit:
      { source: "DEFAULT"
      , value: "none"
      }
    , secondarycache:
      { source: "DEFAULT"
      , value: "all"
      }
    , prevsnap:
      { source: "DEFAULT"
      , value: ""
      }
    , used:
      { source: "NONE"
      , value: "252000"
      }
    , written:
      { source: "NONE"
      , value: "96000"
      }
    , refquota:
      { source: "DEFAULT"
      , value: "none"
      }
    , refcompressratio:
      { source: "NONE"
      , value: "1.00x"
      }
    , quota:
      { source: "DEFAULT"
      , value: "none"
      }
    , vscan:
      { source: "DEFAULT"
      , value: "off"
      }
    , canmount:
      { source: "DEFAULT"
      , value: "on"
      }
    , normalization:
      { source: "NONE"
      , value: "none"
      }
    , usedbydataset:
      { source: "NONE"
      , value: "96000"
      }
    , unique:
      { source: "NONE"
      , value: "96000"
      }
    , checksum:
      { source: "DEFAULT"
      , value: "on"
      }
    , redundant_metadata:
      { source: "DEFAULT"
      , value: "all"
      }
    , filesystem_count:
      { source: "DEFAULT"
      , value: "none"
      }
    , refreservation:
      { source: "DEFAULT"
      , value: "none"
      }
    , logicalreferenced:
      { source: "NONE"
      , value: "9.50000"
      }
    , nbmand:
      { source: "DEFAULT"
      , value: "off"
      }
    }
  };

var volumeDefaults =
  { status: "ONLINE"
  , type: "zfs"
  , scan:
    { errors: null
    , start_time: null
    , bytes_to_process: null
    , state: null
    , end_time: null
    , func: null
    , bytes_processed: null
    , percentage: null
    }
  , "updated-at": time
  , "created-at": time
  , properties:
    { comment:
      { source: "DEFAULT"
      , value: "-"
      }
    , freeing:
      { source: "DEFAULT"
      , value: "0"
      }
    , listsnapshots:
      { source: "DEFAULT"
      , value: "off"
      }
    , leaked:
      { source: "DEFAULT"
      , value: "0"
      }
    , version:
      { source: "DEFAULT"
      , value: "-"
      }
    , delegation:
      { source: "DEFAULT"
      , value: "on"
      }
    , dedupditto:
      { source: "DEFAULT"
      , value: "0"
      }
    , failmode:
      { source: "LOCAL"
      , value: "continue"
      }
    , autoexpand:
      { source: "LOCAL"
      , value: "on"
      }
    , allocated:
      { source: "NONE"
      , value: "288000"
      }
    , guid:
      { source: "DEFAULT"
      , value: "1628701766188201188"
      }
    , altroot:
      { source: "DEFAULT"
      , value: "-"
      }
    , size:
      { source: "NONE"
      , value: "3.62T"
      }
    , fragmentation:
      { source: "NONE"
      , value: "-"
      }
    , capacity:
      { source: "NONE"
      , value: "0%"
      }
    , name:
      { source: "NONE"
      , value: "tank"
      }
    , maxblocksize:
      { source: "NONE"
      , value: "131072"
      }
    , cachefile:
      { source: "LOCAL"
      , value: "/data/zfs/zpool.cache"
      }
    , bootfs:
      { source: "DEFAULT"
      , value: "-"
      }
    , autoreplace:
      { source: "DEFAULT"
      , value: "off"
      }
    , readonly:
      { source: "NONE"
      , value: "off"
      }
    , dedupratio:
      { source: "NONE"
      , value: "1.00x"
      }
    , health:
      { source: "NONE"
      , value: "ONLINE"
      }
    , expandsize:
      { source: "NONE"
      , value: "-"
      }
    }
  };

var nameStarter = "tank";

var vDevGUIDStarter = 2866253151434971358;

var datasetGUIDStarter = 5133185099967636567;

var volumeIDStarter = 2950145407967379177;

// Feel free to mess with these numbers to change what number of disks the
// volume maker will use to decide what kind of vdev to make.
var vdevDiskCounts =
  { raidz3 : 5 // Keep five or greater
  , raidz2 : 4 // Keep four or greater
  , raidz1 : 3 // Keep three or greater
  , mirror : 2 // Keep two or greater
  , disk   : 1 // Do not change
  };

var vdevRedundancy =
  { raidz3 : 3
  , raidz2 : 2
  , raidz1 : 1
  // Do not include mirror; it's variable.
  , disk   : 0
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

// Split out simply because it's used more than once.
function getDiskSize ( disks, path ) {
  return _.find( disks, { name: path } )[ "mediasize" ];
}

function calculateVolumeSize ( dataVdevs, disks ) {

  var volumeSize = 0;

  var smallestDiskSize = Infinity;
  var vdevSize = 0;

  var i;
  var j;

  _.forEach( dataVdevs
           , function calculateVdevSize ( vdev ) {
             vdevSize = 0;
             // Disk vdevs have only one disk and no children to iterate over.
             if ( vdev.type === "disk" ) {
               vdevSize = getDiskSize( disks, vdev[ "path" ] );
             } else {
               // Search for the smallest disk
               for ( i = 0; i < vdev[ "children" ].length; i++ ) {
                 if ( getDiskSize( disks
                                 , vdev[ "children" ][ i ][ "path" ]
                                 )
                    < smallestDiskSize
                    ) {
                   smallestDiskSize =
                     getDiskSize( disks
                                , vdev[ "children" ][ i ][ "path" ]
                                );
                 }
               }
               // The size of a mirror vdev is always the size of its smallest
               // component disk.
               if ( vdev[ "type" ] === "mirror" ) {
                 vdevSize = smallestDiskSize;
               } else {
                 // Add the smallest disk size to the vdev size for each disk
                 // over the vdev redundancy level.
                 for ( j = 0
                     ; j < vdev[ "children" ].length
                         - vdevRedundancy[ vdev[ "type" ] ]
                     ; j ++
                     ) {
                   vdevSize += smallestDiskSize;
                 }
               }
               volumeSize += vdevSize;
             }
           }
           );

  return volumeSize;

}

// Creates a volume called 'name' from the given 'disks'.
// If any of the disks are ssds, they'll be put in log or cache vdevs.
// Where possible, it will try to even out the number of disks to make
// symmetrical vdevs. Extra disks may become spares.
function createVolume ( name, disks, id ) {

  var newVolume = volumeDefaults;
  var topology;
  var newVdev;
  var datasets = [];
  var startingDataset = {};
  var startingDatasetSize = 0;
  var volumeSize;

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

  volumeSize = calculateVolumeSize( topology[ "data" ], disks );

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
           , properties:
             { free:
               { source: "NONE"
               , value: volumeSize
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

  var name;
  var mountpoint;
  var volumeDisks = [];
  var id;

  var i;
  var j;

  var nextVolume;

  for ( i = 0; i < config[ "volumeCount" ]; i++ ) {
    nextVolume = {};

    name = nameStarter + i;
    mountpoint = "/volumes/" + name;
    id = volumeIDStarter + i;

    volumeDisks = disks.splice( 0, config[ "volumeDiskCount" ] );

    nextVolume = createVolume( name, volumeDisks, id );

    newVolumes.push( nextVolume );
  }

  return newVolumes;
}

module.exports = createVolumes;
