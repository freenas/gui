// Disks RPC Class
// ===============
// Provides RPC functions for the disks namespace.

"use strict";

import RPCBase from "../RPC_BASE_CLASS";

class Disks extends RPCBase {

  constructor () {
    super();
  }

  query ( system ) {
    return system[ "disks" ];
  }

}


export default Disks;
