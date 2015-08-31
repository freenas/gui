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
    this.CHANGE_EVENT.push( this.interfaces.CHANGE_EVENT );
  }

  configure ( system, args, callback ) {

    var newSystem = _.cloneDeep( system );
    var newNetworkConfig = _.cloneDeep( newSystem[ "globalNetworkConfig" ] );
    const timeout = 2500;

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
                   , _.cloneDeep( newSystem[ "globalNetworkConfig" ] )
                   , timeout
                   );
    this.emitTask( this.namespace
                 , "network.configure"
                 , timeout
                 , "root"
                 , args[0]
                 , _.cloneDeep( newSystem[ "globalNetworkConfig" ] )
                 , true
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

  up ( system, args, callback ) {
    var newSystem = _.cloneDeep( system );
    var newInterfaces = _.cloneDeep( system[ "interfaces" ] );
    var newInterfaceIndex = _.findIndex( newInterfaces, { name: args[0] } );
    var newInterface = newInterfaces[ newInterfaceIndex ];
    const timeout = 1500;

    if ( newInterface[ "status" ][ "link-state" ] === "LINK_STATE_DOWN" ) {
      newInterface[ "status" ][ "link-state" ] = "LINK_STATE_UP";

      newInterfaces[ newInterfaceIndex ] = newInterface;

      newSystem[ "interfaces" ] = newInterfaces;

      callback( newSystem, newInterfaces );

      this.emitChange( "network.interfaces.changed"
                     , "network.interfaces.up"
                     , _.cloneDeep( newInterface )
                     , timeout
                     );

      this.emitTask( this.namespace
                   , "network.interfaces.up"
                   , timeout
                   , "operator"
                   , args[0]
                   , _.cloneDeep( newInterface )
                   , true
                   );
    } else {
      // TODO: Error response.
    }
  }

  down ( system, args, callback ) {
    var newSystem = _.cloneDeep( system );
    var newInterfaces = _.cloneDeep( system[ "interfaces" ] );
    var newInterfaceIndex = _.findIndex( newInterfaces, { name: args[0] } );
    var newInterface = newInterfaces[ newInterfaceIndex ];
    const timeout = 1500;

    if ( newInterface[ "status" ][ "link-state" ] === "LINK_STATE_UP" ) {
      newInterface[ "status" ][ "link-state" ] = "LINK_STATE_DOWN";

      newInterfaces[ newInterfaceIndex ] = newInterface;

      newSystem[ "interfaces" ] = newInterfaces;

      callback( newSystem, newInterfaces );

      this.emitChange( "network.interfaces.changed"
                     , "network.interfaces.down"
                     , _.cloneDeep( newInterface )
                     , timeout
                     );

      this.emitTask( this.namespace
                   , "network.interfaces.down"
                   , timeout
                   , "operator"
                   , args[0]
                   , _.cloneDeep( newInterface )
                   , true
                   );
    } else {
      // TODO: Error response.
    }

  }

  configure ( system, args, callback ) {
    var newSystem = _.cloneDeep( system );
    var newInterfaces = _.cloneDeep( system[ "interfaces" ] );
    var newInterfaceIndex = _.findIndex( newInterfaces, { name: args[0] } );
    var newInterface = newInterfaces[ newInterfaceIndex ];

    _.merge( newInterface
           , args[1]
           , function mergeHard ( oldProp, newProp ) {
             return newProp;
           }
           );

    newInterfaces[ newInterfaceIndex ] = newInterface;

    newSystem[ "interfaces" ] = newInterfaces;

    callback( newSystem, newInterfaces );

    this.emitChange( "network.interfaces.changed"
                   , "network.interfaces.configure"
                   , _.cloneDeep( newInterface )
                   );

    // TODO: Error handling, validity checking.
  }

  query ( system ) {
    return system[ "interfaces" ];
  }
}


export default Network;
