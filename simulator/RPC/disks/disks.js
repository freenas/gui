// Disks RPC Class
// ===============
// Provides RPC functions for the disks namespace.

"use strict";

import RPCBase from "../RPC_BASE_CLASS";

class Disks extends RPCBase {

  constructor () {
    super();

    this.namespace = "disks";
    this.CHANGE_EVENT = "disks.changed";
  }

  query ( system ) {
    return system[ "disks" ];
  }

}


export default Disks;
