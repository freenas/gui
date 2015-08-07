// Default System Configuration
// ============================
// Provides the default system configuration for the middleware simulation
// system generator.

"use strict";

import _ from "lodash";

function systemConfig () {

  var newSystem = {};

  var disksConfig =
    { disksConfig:
      { diskCount: 10
      // Permissible disk types are "SDD", "HDD", or "BOTH". An invalid setting
      // will behave like "HDD".
      , diskTypes: "BOTH"
      // Disk sizes are in bytes.
      , hddSize: 4000787030016 // Roughly 4TB
      , ssdSize: 16013377536 // Roughly 16GB
      }
    };

  var volumesConfig =
    { volumesConfig:
      { volumeCount: 0
      // All volumes will have this number of disks.
      , volumeDiskCount: 0
      }
    };

  _.merge( newSystem, disksConfig, volumesConfig );

  return newSystem;

}

export default systemConfig;
