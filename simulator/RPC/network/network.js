// Network RPC Class
// ===================
// Provides RPC functions for the network namespace.

"use strict";

import { EventEmitter } from "events";

class Network extends EventEmitter {

  constructor () {
    super();
    this.config = new Config();
    this.interfaces = new Interfaces();
  }
}

class Config extends EventEmitter {
  constructor () {
    super();
  }

  get_global_config ( system ) {
    return system[ "globalNetworkConfig" ];
  }
}

class Interfaces extends EventEmitter {
  constructor () {
    super();
  }

  query ( system ) {
    return system[ "interfaces" ];
  }
}


export default Network;
