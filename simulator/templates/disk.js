// Disk Config Generator
// =====================
// Produces example disks for use in simulated machines in the middleware
// simulator.

"use strict";

import _ from "lodash";
import moment from "moment";

const time = moment().unix();

const ssdDefaults =
  { status:
    { "is-ssd" : true
    // These are from the FreeNAS Mini boot drive.
    , description : "16GB SATA Flash Drive"
    , model: "16GB SATA Flash Drive"
    , manufacturer: "Samsung"
    }
  };

const hddDefaults =
  { status:
    { "is-ssd" : false
      // These are from the WD drives used in the FreeNAS Mini
    , description: "WDC WD40EFRX-68WT0N0"
    , "max-rotation": 5400
    , model: "WDC WD40EFRX-68WT0N0"
    , manufacturer: "Western Digital"
    }
  };

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
const uuidBase = "7abad094-2438-11e5-b86d-d";

const ssdSerialBase = "B061448240070000039";

const hddSerialBase = "WD-WCC4ENSDRSV";

// 'config[ "diskCount" ]' should be an integer greater than zero
// 'config[ "types" ]' should be one of "HDD", "SSD", or "BOTH". If it's none of
// the above, it will default to HDD. When "BOTH" is chosen, one of every 3
// disks will be an SSD.
function createDisks ( config ) {
  var disks = [];

  for ( let i = 0; i < config[ "diskCount" ]; i++ ) {

    let newDisk = {};
    let serial = "";
    let id = "";
    let uuid = "";

    switch ( config[ "diskTypes"] ) {
      case "SSD":
        serial = ssdSerialBase + i;
        newDisk = _.merge( ssdDefaults, defaults );
        newDisk[ "mediasize" ] = config[ "ssdSize" ];
        break;

      case "BOTH":
        if ( i % 4 === 3 ) {
          serial = ssdSerialBase + i;
          newDisk = _.merge( ssdDefaults, defaults );
          newDisk[ "mediasize" ] = config[ "ssdSize" ];
          break;
        }
        // deliberate lack of both an else and a break here, so that
        // otherwise it falls through to case "HDD"

      case "HDD":
      default:
        serial = hddSerialBase + i;
        newDisk = _.merge( hddDefaults, defaults );
        newDisk[ "mediasize" ] = config[ "hddSize" ];
        break;
    }

    id = "serial:" + serial;

    // Just use /dev/da* for everything for now.
    // FIXME: This is because the boot drive is hardcoded to be /dev/ada2.
    newDisk[ "name" ] = "/dev/da" + i;
    newDisk[ "path" ] = newDisk[ "name" ];
    newDisk[ "serial" ] = serial;

    newDisk[ "controller"] =
      { "controller-unit" : i
      , "path-id" : i
      , serial: serial
      , id: id
      };

    uuid = uuidBase + "0509950453" + i;
    newDisk[ "swap-partition-uuid" ] = uuid;
    newDisk[ "swap-partition-path" ] = "/dev/gptid/" + uuid;

    disks.push( _.cloneDeep( newDisk ) );
  }

  return disks;
}

module.exports = createDisks;
