// Network
// =======

"use strict";

import React from "react";
import _ from "lodash";

import IM from "../../flux/middleware/InterfacesMiddleware";
import IS from "../../flux/stores/InterfacesStore";

import NM from "../../flux/middleware/NetworkConfigMiddleware";
import NS from "../../flux/stores/NetworkConfigStore";

import SM from "../../flux/middleware/SystemMiddleware";
import SS from "../../flux/stores/SystemStore";

import NetworkConfig from "./Network/NetworkConfig";
import InterfaceItem from "./Network/InterfaceItem";

function getInterfaces () {
  var interfaces = IS.interfaces || [];

  return interfaces;
}

function getNetworkConfig () {
  // Default network config values.
  const defaultNetworkConfig =
    { dhcp:
      { assign_gateway: false
      , assign_dns: false
      }
    , http_proxy: null
    , autoconfigure: false
    , dns:
      { search: []
      , servers: []
      }
    , gateway:
      { ipv4: ""
      , ipv6: ""
      }
    };

  var networkConfig = _.defaultsDeep( NS.networkConfig
                                    , defaultNetworkConfig );

  return networkConfig;

}

function getSystemGeneralConfig () {
  // Default system general config values.
  const defaultSystemGeneralConfig =
    { timezone: ""
    , hostname: ""
    , language: ""
    , console_keymap: ""
  };

  var systemGeneralConfig =
    _.defaultsDeep( SS.systemGeneralConfig
                  , defaultSystemGeneralConfig );

  return systemGeneralConfig;
}

const Network = React.createClass(
  { getInitialState: function () {
    return { interfaces: getInterfaces()
           , networkConfig: getNetworkConfig()
           , systemGeneralConfig: getSystemGeneralConfig()
           };
  }

  , componentDidMount () {
    IS.addChangeListener( this.handleInterfacesChange );
    IM.requestInterfacesList();
    IM.subscribe( this.constructor.displayName )

    NS.addChangeListener( this.handleNetworkConfigChange );
    NM.requestNetworkConfig();
    NM.subscribe( this.constructor.displayName );

    SS.addChangeListener( this.handleSystemGeneralConfigChange );
    SM.requestSystemGeneralConfig();
    SM.subscribe( this.constructor.displayName );
  }

  , componentWillUnmount () {
    IS.removeChangeListener( this.handleInterfacesChange );
    IM.unsubscribe( this.constructor.displayName );

    NS.removeChangeListener( this.handleNetworkConfigChange );
    NM.unsubscribe( this.constructor.displayName );

    SS.removeChangeListener( this.handleSystemGeneralConfigChange );
    SM.unsubscribe( this.constructor.displayName );
  }

  , handleInterfacesChange () {
    this.setState( { interfaces: getInterfaces() } );
  }

  , handleNetworkConfigChange () {
    this.setState( { networkConfig: getNetworkConfig() } );
  }

  , handleSystemGeneralConfigChange () {
    this.setState( { systemGeneralConfig: getSystemGeneralConfig() } );
  }

  , render () {
    var interfaces = [];
    var networkConfig = null;

    // Why is this necessary even though interfaces is returned in getInitialState?
    if ( _.has( this, [ "state", "interfaces" ] ) ) {
      interfaces = _.map( this.state.interfaces
                        , function createInterfaceItems ( networkInterface, key ) {
                          return ( <InterfaceItem
                            interface = { networkInterface }
                            key = { networkInterface[ "name" ] } /> );
                        }
                        );
    }

    if ( _.has( this, [ "state", "networkConfig" ] )
      && _.has( this, [ "state", "systemGeneralConfig" ] ) ) {
      networkConfig = <NetworkConfig
                        networkConfig = { this.state.networkConfig }
                        systemGeneralConfig = { this.state.systemGeneralConfig } />
    }

    return (
      <main>
        <div>
          { networkConfig }
          <div className = "interface-item-container">
            { interfaces }
          </div>
        </div>
      </main>
    );
  }
});

export default Network;
