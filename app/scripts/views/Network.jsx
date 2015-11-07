// Network
// =======

"use strict";

import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import * as SUBSCRIPTIONS from "../actions/subscriptions";
import * as INTERFACES from "../actions/interfaces";
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
    return (
      <main>
        <h1 className="view-header section-heading type-line">
          <span className="text">Network</span>
        </h1>
        <div>
        <NetworkConfig
          { ...this.props.serverConfig }

          onUpdate = { this.props.updateNetworkConfig }
          onRevert = { () => { this.props.revertNetworkConfig();
                               this.props.resetHostname();
                             }
                     }
          onSubmit = { () => { this.props.submitNetworkConfig()
                               this.props.submitHostNameUpdateTask()
                             }
                     }
          onUpdateHostname = { this.props.updateHostname }
          submitDisabled = { this.props.submitConfigDisabled }
          revertDisabled = { this.props.revertConfigDisabled }
        />
          <hr className = "network-divider" />
          <div className = "interface-item-container">
            { [ ...this.props.ether ].map( ( id, index ) =>
                <InterfaceItem
                  updateInterface = { this.props.updateInterface }
                  resetInterface = { this.props.resetInterface }
                  toggleInterface = { this.props.toggleInterfaceTaskRequest }
                  configureInterface = { this.props.configureInterfaceTaskRequest }
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
    , interfaces: state.interfaces.interfaces
    // Interface types
    , loopback: state.interfaces.loopback
    , ether: state.interfaces.ether
    , vlan: state.interfaces.vlan
    , bridge: state.interfaces.bridge
    , lagg: state.interfaces.lagg
    , unknown: state.interfaces.unknown

    // TODO
    , serverConfig: Object.assign( {}
                                 , state.network.serverConfig
                                 , state.network.clientConfig
                                 , { hostname: state.system.hostnameEdit !== null
                                             ? state.system.hostnameEdit
                                             : state.system.general.hostname
                                   }
                                 )
    , submitConfigDisabled: Boolean( Object.keys( state.network.clientConfig ).length === 0
                                  && !state.system.hostnameEdit
                                   )
    , revertConfigDisabled: Boolean( Object.keys( state.network.clientConfig ).length === 0
                                  && state.system.hostnameEdit !== null
                                   )
    }
  );
}

const SUB_MASKS =
  [ "entity-subscriber.network.interfaces.changed"
  , "network.changed"
  ];

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

    , updateInterface: ( interfaceID, path, value ) =>
      dispatch( INTERFACES.updateInterface( interfaceID, path, value ) )
    , resetInterface: ( interfaceID ) =>
      dispatch( INTERFACES.resetInterface( interfaceID ) )
    , toggleInterfaceTaskRequest: ( interfaceID ) =>
      dispatch( INTERFACES.toggleInterfaceTaskRequest( interfaceID ) )
    , configureInterfaceTaskRequest: ( interfaceID ) =>
      dispatch( INTERFACES.configureInterfaceTaskRequest() )

    , updateHostname: ( hostname ) =>
      dispatch( SYSTEM.updateHostname( hostname ) )
    , resetHostname: () => dispatch( SYSTEM.resetHostname() )
    , submitHostNameUpdateTask: () =>
      dispatch( SYSTEM.submitHostNameUpdateTask() )

    // GET INITIAL DATA
    , fetchData: () => {
        dispatch( SYSTEM.requestGeneralConfig() );
        dispatch( NETWORK.requestNetworkConfig() );
        dispatch( INTERFACES.requestNetworkInterfaces() );
      }
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Network );
