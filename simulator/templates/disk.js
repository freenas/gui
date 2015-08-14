// Disk Config Generator
// =====================
// Produces example disks for use in simulated machines in the middleware
// simulator.

"use strict";

import _ from "lodash";
import moment from "moment";

const time = moment().unix();

const defaults =
  { status :
    { sectorsize: 512
    , "smart-enabled": true
    , "smart-status": "PASS"
    , "smart-capable": true
    , schema: "GPT"
    }
  , controller:
    { "target-id": 0
    , "controller-name": "ahcich"
    , "bus-id": 0
    , "target-lun": 0
    }
  , "smart-status": "PASS"
  , "smart-capable": true
  , "updated-at": time
  , "created-at": time
  , online: true
  // Generic S.M.A.R.T. stats for demonstration purposes. S.M.A.R.T. will NOT
  // work like this in the real system.
  , "smart-statistics":
    { Temperature_Celcius: 29
    , Power_On_Hours: 1200
    , Load_CycleCount: 150
    , Reallocated_Sector_Ct: 0
    }
  };

// Real UUIDs are for suckers (and take too long to generate every time the
// server restarts.)
const uuidBase = "7abad094-2438-11e5-b86d-d0509950453";

function createDisks ( config ) {
  var disks = [];
  var diskNameSuffix = 0;
  _.forEach(
      config[ "diskTypes" ]
    , function createDisksOfType ( diskType, diskName ) {
      for ( let i = 0; i < diskType[ "diskCount" ]; i++ ) {
        console.log( diskName );
        let newDisk = _.cloneDeep( diskType );
        delete newDisk[ "diskCount" ];

        newDisk[ "serial" ] = newDisk[ "serial" ] + i;
        newDisk[ "id" ] = "serial:" + newDisk[ "serial" ];

        newDisk[ "controller"] =
            // distribute controller unit and path id number evenly across the ones in the config
          { "controller-unit": newDisk[ "controller"][ "controller-unit" ][ i % newDisk[ "controller"][ "controller-unit" ].length ]
          , "path-id": newDisk[ "controller"][ "path-id" ][ i % newDisk[ "controller"][ "path-id" ].length ]
          , serial: newDisk[ "serial" ]
          , id: newDisk[ "id" ]
          };

        newDisk[ "name" ] = "/dev/da" + diskNameSuffix;
        diskNameSuffix++;
        newDisk[ "path" ] = newDisk[ "name" ];

        let uuid = uuidBase + i;
        newDisk[ "swap-partition-uuid" ] = uuid;
        newDisk[ "swap-partition-path" ] = "/dev/gptid/" + uuid;

        _.defaultsDeep( newDisk, defaults );

        disks.push( _.cloneDeep( newDisk ) );
      }
    }
  );

  return disks;
}

module.exports = createDisks;
