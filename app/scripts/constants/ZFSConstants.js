
// DATASET NAME BLACKLIST
// This set represents all of the strings and regexps that should be blacklisted
// by the GUI in most situations
export const DATASET_NAME_BLACKLIST = new Set(
  [ "iocage"
  , /^\./
  ]
);

// NEW VOLUME
// Used to initialize the required property values for a new volume
export const NEW_VOLUME =
  { name: ""
  , topology:
    { data  : []
    , log   : []
    , cache : []
    , spare : []
    }
  , datasets: []
  , properties:
    { free      : { rawvalue: 0 }
    , allocated : { rawvalue: 0 }
    , size      : { rawvalue: 0 }
    }
  };
