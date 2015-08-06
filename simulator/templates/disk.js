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
    , mediasize : 16013942784
    }
  , mediasize : 16013942784
  };

const hddDefaults =
  { status:
    { "is-ssd" : true
      // These are from the WD drives used in the FreeNAS Mini
    , description: "WDC WD40EFRX-68WT0N0"
    , "max-rotation": 5400
    , mediasize: 4000787030016
    , model: "WDC WD40EFRX-68WT0N0"
    }
  , mediasize: 4000787030016
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
  , "updated-at": time
  , "created-at": time
  , online: true
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
  var newDisk = {};

  var serial;
  var id;

  var uuid;

  for ( var i = 0; i < config[ "diskCount" ]; i++ ) {

    newDisk = {};

    // FIXME (if we care): over 10 disks, you end up with serials that are
    // longer than normal, because I can't be bothered to do anything other
    // than string concatenation for this.
    if ( config[ "types" ] === "SSD" ) {
      serial = ssdSerialBase + i;
    } else if ( config[ "types" ] === "BOTH" && i % 3 === 1 ) {
      serial = ssdSerialBase + i;
    } else {
      serial = hddSerialBase + i;
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

    // This is stored both inside the controller and at the top level.
    // newDisk[ "serial" ] = serial;

    uuid = uuidBase + "0509950453" + i;
    newDisk[ "swap-partition-uuid" ] = uuid;
    newDisk[ "swap-partition-path" ] = "/dev/gptid/" + uuid;

    // TODO: Partitions. Those are nuts.

    if ( config[ "types" ] === "SSD" ) {
      newDisk = _.merge( newDisk, ssdDefaults, defaults );
    // Every third disk will be an SSD is "BOTH" is selected.
    } else if ( config[ "types" ] === "BOTH" && i % 3 === 1 ) {
      newDisk = _.merge( newDisk, ssdDefaults, defaults );
    } else {
      newDisk = _.merge( newDisk, hddDefaults, defaults );
    }
    disks.push( newDisk );
  }

  return disks;
}

module.exports = createDisks;
