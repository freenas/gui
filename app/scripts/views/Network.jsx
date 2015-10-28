// Network
// =======

"use strict";

import React from "react";
import _ from "lodash";

import IM from "../flux/middleware/InterfacesMiddleware";
import IS from "../flux/stores/InterfacesStore";
import NM from "../flux/middleware/NetworkConfigMiddleware";
import NS from "../flux/stores/NetworkConfigStore";

import NetworkConfig from "./Network/NetworkConfig";
import InterfaceItem from "./Network/InterfaceItem";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Network.less" );


export default class Network extends React.Component {

  constructor ( props ) {
    super( props );

    this.displayName = "Network";

    this.onChangedIS = this.handleChangedIS.bind( this );
    this.onChangedNS = this.handleChangedNS.bind( this );

    this.state =
      { interfaces          : IS.interfaces
      , networkConfig       : NS.networkConfig
      };
  }

  componentDidMount () {
    IS.addChangeListener( this.onChangedIS );
    NS.addChangeListener( this.onChangedNS );

    IM.subscribe( this.displayName );
    NM.subscribe( this.displayName );

    IM.requestInterfacesList();
    NM.requestNetworkConfig();
  }

  componentWillUnmount () {
    IS.removeChangeListener( this.onChangedIS );
    NS.removeChangeListener( this.onChangedNS );

    IM.unsubscribe( this.displayName );
    NM.unsubscribe( this.displayName );
  }

  handleChangedIS () {
    this.setState({ interfaces: IS.interfaces });
  }

  handleChangedNS () {
    this.setState({ networkConfig: NS.networkConfig });
  }

  createInterfaceItems ( networkInterface, index ) {
    return (
      <InterfaceItem
        { ...networkInterface }
        key = { index }
      />
    );
  }

  render () {
    return (
      <main>
        <h1 className="view-header section-heading type-line">
          <span className="text">Network</span>
        </h1>
        <div>
        <NetworkConfig
            networkConfig       = { this.state.networkConfig }
            systemGeneralConfig = { { hostname: "" } }
        />
          <hr className = "network-divider" />
          <div className = "interface-item-container">
            { this.state.interfaces.map(
                this.createInterfaceItems.bind( this )
              )
            }
          </div>
        </div>
      </main>
    );
  }
}
