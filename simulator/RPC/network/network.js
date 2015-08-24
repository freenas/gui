// Network RPC Class
// ===================
// Provides RPC functions for the network namespace.

"use strict";

import _ from "lodash";

import RPCBase from "../RPC_BASE_CLASS";

class Network extends RPCBase {

  constructor () {
    super();
    this.config = new Config();
    this.interfaces = new Interfaces();
    this.namespace = "network";
    this.CHANGE_EVENT = [ "network.updated" ];
    this.CHANGE_EVENT.push( this.config.CHANGE_EVENT );
  }

  configure ( system, args, callback ) {

    var newSystem = _.cloneDeep( system );
    var newNetworkConfig = _.cloneDeep( newSystem[ "globalNetworkConfig" ] );

    // Why is the manual merge function necessary? Without it, deleting DNS
    // servers fails.
    _.merge( newNetworkConfig
           , args[0]
           , function mergeConfig ( oldProp, newProp, key ) {
             return newProp;
           } );

    newSystem[ "globalNetworkConfig" ] = newNetworkConfig;

    callback( newSystem, newSystem[ "globalNetworkConfig" ] );

    this.emitChange( "network.updated"
                   , "network.configure"
                   , newSystem[ "globalNetworkConfig" ]
                   );

  }
}

class Config extends RPCBase {
  constructor () {
    super();
    this.namespace = "network.config";
    this.CHANGE_EVENT = "network.config.updated";
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
