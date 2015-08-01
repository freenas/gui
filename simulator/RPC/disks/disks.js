// Disks RPC Class
// ===============
// Provides RPC functions for the disks namespace.

"use strict";

import { EventEmitter } from "events";

class Disks extends EventEmitter {

  constructor () {
    super();
  }

  query ( system ) {
    return system[ "disks" ];
  }

}


export default Disks;
