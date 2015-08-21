// ZFS CONTSTANTS
// ==============
// Reusable and generic reference constants for applications of ZFS business
// logic throughout the webapp.

"use strict";

export const VDEV_TYPES =
  { data: [ "disk", "stripe", "mirror", "raidz1", "raidz2", "raidz3" ]
  , logs: [ "disk", "stripe", "mirror" ]
  , cache: [ "disk", "stripe", "mirror" ]
  , spares: [ "disk", "stripe" ]
};

export const DISK_CHUNKS =
  { mirror:
      { speed: 2
      , safety: 2
      , storage: 2
      }
  , raidz1:
      { speed: 3
      , safety: 5
      , storage: 7
      }
  , raidz2:
      { speed: 4
      , safety: 5
      , storage: 6
      }
  };
