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
    this.namespace = "network";
    this.CHANGE_EVENT = "network.changed";
  }
}

class Config extends RPCBase {
  constructor () {
    super();
    this.namespace = "network.config";
    this.CHANGE_EVENT = "network.config.changed";
  }

  get_global_config ( system ) {
    return system[ "globalNetworkConfig" ];
  }
}

class Interfaces extends RPCBase {
  constructor () {
    super();
    this.namespace = "network.interfaces";
    this.CHANGE_EVENT = "network.interfaces.changed";
  }

  query ( system ) {
    return system[ "interfaces" ];
  }
}


export default Network;
