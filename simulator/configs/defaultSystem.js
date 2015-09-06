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
      { diskTypes:
        { wdRed:
          { status:
            { manufacturer: "Western Digital"
            , description: "WDC WD40EFRX-68WT0N0"
            , model: "WDC WD40EFRX-68WT0N0"
            , "max_rotation": 5400
            , "is_ssd": false
            }
          , mediasize: 4000787030016 // Roughly 4TB
          , serial: "WD-WCC4ENSDRSV"
            // Disks will be split evenly across these units
          , controller:
            { "controller-unit": [ 1, 2 ]
            , "path-id": [1, 2 ]
            }
          , diskCount: 20
          }
        , samsungSSD:
          { status:
            { manufacturer: "Samsung"
            , description: "16GB SATA Flash Drive"
            , model: "16GB SATA Flash Drive"
            , "is_ssd": true
            }
          , mediasize: 16013377536 // Roughly 16GB
          , serial: "B061448240070000039"
          , controller:
            { "controller-unit": [ 3 ]
            , "path-id": [ 3 ]
            }
          , diskCount: 2
          }
        , oczSSD:
          { status:
            { manufacturer: "OCZ"
            , description: "FreeNAS Mini ZIL"
            , model: "FreeNAS Mini ZIL rev. 2"
            , "is_ssd": true
            }
          , mediasize: 8006688768 // Roughly 8GB
          , serial: "A19D101121600854"
          , controller:
            { "controller-unit": [ 4 ]
            , "path-id": [ 4 ]
            }
          , diskCount: 2
          }
        }
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
