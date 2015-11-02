
// DATASET NAME BLACKLIST
// This set represents all of the strings and regexps that should be blacklisted
// by the GUI in most situations
export const DATASET_NAME_BLACKLIST = new Set(
  [ "iocage"
  , /^\./
  ]
);


export function createBlankTopology () {
  return (
    { data  : []
    , log   : []
    , cache : []
    , spare : []
    }
  );
}

// NEW VOLUME
// Used to initialize the required property values for a new volume
export function createVolumeInitialValues () {
  return (
    { name: ""
    , topology: createBlankTopology()
    , datasets: []
    , properties:
      { free      : { rawvalue: 0 }
      , allocated : { rawvalue: 0 }
      , size      : { rawvalue: 0 }
      }
    // WEBAPP ONLY
    , preset: "None"
    , selectedDisks: new Set()
    }
  );
}

// TOPOLOGY PRESETS
// Use in conjunction with
export const PRESET_VALUES = Object.freeze(
  { "Optimal":
      { desired: [ "raidz1", "mirror" ]
      , highest: 1
      , priority: "storage"
      }
  , "Virtualization":
      { desired: [ "mirror" ]
      , highest: 1
      , priority: "speed"
      }
  , "Backups":
      { desired: [ "raidz2", "raidz1", "mirror" ]
      , highest: 1
      , priority: "safety"
      }
  , "Media":
      { desired: [ "raidz1", "mirror" ]
      , highest: 1
      , priority: "speed"
      }
  }
);
