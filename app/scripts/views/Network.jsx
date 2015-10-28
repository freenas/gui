// Network
// =======

"use strict";

import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import * as SUBSCRIPTIONS from "../actions/subscriptions";
import * as NETWORK from "../actions/network";
import * as SYSTEM from "../actions/system";

import NetworkConfig from "./Network/NetworkConfig";
import InterfaceItem from "./Network/InterfaceItem";


// STYLESHEET
if ( process.env.BROWSER ) require( "./Network.less" );


// REACT
class Network extends React.Component {

  constructor ( props ) {
    super( props );

    this.displayName = "Network";
  }

  componentDidMount () {
    this.props.subscribe( this.displayName );
    this.props.fetchData();
  }

  componentWillUnmount () {
    this.props.unsubscribe( this.displayName );
  }

  render () {
    const INTERFACE_IDS = Object.keys( this.props.interfaces );

    return (
      <main>
        <h1 className="view-header section-heading type-line">
          <span className="text">Network</span>
        </h1>
        <div>
        <NetworkConfig
          { ...this.props.serverConfig }
          hostname = { this.props.hostname }

          onUpdate = { this.props.updateNetworkConfig }
          onRevert = { this.props.revertNetworkConfig }
          onSubmit = { this.props.submitNetworkConfig }
          submitDisabled = { this.props.submitConfigDisabled }
          revertDisabled = { this.props.revertConfigDisabled }
        />
          <hr className = "network-divider" />
          <div className = "interface-item-container">
            { INTERFACE_IDS.map( ( id, index ) =>
                <InterfaceItem
                  { ...this.props.interfaces[ id ] }
                  key = { index }
                />
              )
            }
          </div>
        </div>
      </main>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  return (
    { systemGeneral: state.system.general
    , hostname: state.system.general.hostname
    , interfaces: {}
    // TODO
    , serverConfig: Object.assign( {}
                                 , state.network.serverConfig
                                 , state.network.clientConfig
                                 )
    , submitConfigDisabled: Boolean( Object.keys( state.network.clientConfig ).length === 0 )
    , revertConfigDisabled: Boolean( Object.keys( state.network.clientConfig ).length === 0 )
    }
  );
}

const SUB_MASKS = [ "network.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (
    { subscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    , updateNetworkConfig: ( path, value ) =>
      dispatch( NETWORK.updateNetworkConfig( path, value ) )
    , revertNetworkConfig: () =>
      dispatch( NETWORK.revertNetworkConfig() )
    , submitNetworkConfig: () =>
      dispatch( NETWORK.submitNetworkConfig() )

    // GET INITIAL DATA
    , fetchData: () => {
        dispatch( SYSTEM.requestGeneralConfig() );
        dispatch( NETWORK.requestNetworkConfig() );
      }
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Network );
