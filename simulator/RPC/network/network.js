// Network RPC Class
// ===================
// Provides RPC functions for the network namespace.

"use strict";

import RPCBase from "../RPC_BASE_CLASS";

class Network extends RPCBase {

  constructor () {
    super();
    this.config = new Config();
    this.interfaces = new Interfaces();
  }
}

class Config extends RPCBase {
  constructor () {
    super();
  }

  get_global_config ( system ) {
    return system[ "globalNetworkConfig" ];
  }
}

class Interfaces extends RPCBase {
  constructor () {
    super();
  }

  query ( system ) {
    return system[ "interfaces" ];
  }
}


export default Network;
