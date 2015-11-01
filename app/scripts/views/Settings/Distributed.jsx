// Distributed Sharing Service Settings
// ====================================
// Settings for distributed sharing services: IPVS, riak, riakcs

"use strict";

import React from "react";
import { Col } from "react-bootstrap";
import { connect } from "react-redux";

import * as ipfsActions from "../../actions/ipfs";
import * as riakActions from "../../actions/riak";
import * as riakCSActions from "../../actions/riakcs";

import * as SUBSCRIPTIONS from "../../actions/subscriptions";

import IPFS from "./Distributed/IPFS";
import Riak from "./Distributed/Riak";
import RiakCS from "./Distributed/RiakCS";

class Distributed extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "Distributed Services Settings";
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
      <div className="view-content">
        <Col xs = {4}>
          <IPFS { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <Riak { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <RiakCS { ...this.props }/>
        </Col>
      </div>
    );
  }
};

function mapStateToProps ( state ) {
  return ( { ipfsServerState:
             { enable: state.ipfs.ipfsServerState.enable
             , path: state.ipfs.ipfsServerState.path
             }
           , ipfsForm: state.ipfs.ipfsForm
           , riakServerState:
             { enable: state.riak.riakServerState.enable
             , listener_protobuf_internal: state.riak.riakServerState.listener_protobuf_internal
             , nodename: state.riak.riakServerState.nodename
             , node_ip: state.riak.riakServerState.node_ip
             , object_size_warning_threshold: state.riak.riakServerState.object_size_warning_threshold
             , storage_backend: state.riak.riakServerState.storage_backend
             , save_description: state.riak.riakServerState.save_description
             , riak_control: state.riak.riakServerState.riak_control
             , listener_protobuf_internal_port: state.riak.riakServerState.listener_protobuf_internal_port
             , log_console_level: state.riak.riakServerState.log_console_level
             , listener_http_internal: state.riak.riakServerState.listener_http_internal
             , listener_http_internal_port: state.riak.riakServerState.listener_http_internal_port
             , buckets_default_allow_multi: state.riak.riakServerState.buckets_default_allow_multi
             , listener_https_internal_port: state.riak.riakServerState.listener_https_internal_port
             , listener_https_internal: state.riak.riakServerState.listener_https_internal
             , object_size_maximum: state.riak.riakServerState.object_size_maximum
             }
           , riakForm: state.riak.riakForm
           , riakCSServerState:
             { enable: state.riakcs.riakCSServerState.enable
             , admin_secret: state.riakcs.riakCSServerState.admin_secret
             , nodename: state.riakcs.riakCSServerState.nodename
             , node_ip: state.riakcs.riakCSServerState.node_ip
             , stanchion_host_port: state.riakcs.riakCSServerState.stanchion_host_port
             , admin_key: state.riakcs.riakCSServerState.admin_key
             , listener_port: state.riakcs.riakCSServerState.listener_port
             , riak_host_ip: state.riakcs.riakCSServerState.riak_host_ip
             , riak_host_port: state.riakcs.riakCSServerState.riak_host_port
             , anonymous_user_creation: state.riakcs.riakCSServerState.anonymous_user_creation
             , max_buckets_per_user: state.riakcs.riakCSServerState.max_buckets_per_user
             , log_console_level: state.riakcs.riakCSServerState.log_console_level
             , stanchion_host_ip: state.riakcs.riakCSServerState.stanchion_host_ip
             , listener_ip: state.riakcs.riakCSServerState.listener_ip
             }
           , riakCSForm: state.riakcs.riakCSForm
           }
         );
};

const SUB_MASKS = [ "entity-subscriber.services.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (

    { subscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    // FORMS
    , updateIPFSForm: ( field, value ) =>
        dispatch( ipfsActions.updateIPFSForm( field, value ) )
    , resetIPFSForm: () => dispatch( ipfsActions.resetIPFSForm() )
    , updateRiakForm: ( field, value ) =>
        dispatch( riakActions.updateRiakForm( field, value ) )
    , resetRiakForm: () => dispatch( riakActions.resetRiakForm() )
    , updateRiakCSForm: ( field, value ) =>
        dispatch( riakCSActions.updateRiakCSForm( field, value ) )
    , resetRiakCSForm: () => dispatch( riakCSActions.resetRiakCSForm() )

    // QUERIES
    , fetchData: () => {
      dispatch( ipfsActions.requestIPFSConfig() );
      dispatch( riakActions.requestRiakConfig() );
      dispatch( riakCSActions.requestRiakCSConfig() );
    }

    // TASKS
    , configureIPFSTaskRequest: () =>
        dispatch( ipfsActions.configureIPFSTaskRequest() )
    , toggleIPFSTaskRequest: () => dispatch( ipfsActions.toggleIPFSTaskRequest() )
    , configureRiakTaskRequest: () =>
        dispatch( riakActions.configureRiakTaskRequest() )
    , toggleRiakTaskRequest: () => dispatch( riakActions.toggleRiakTaskRequest() )
    , configureRiakCSTaskRequest: () =>
        dispatch( riakCSActions.configureRiakCSTaskRequest() )
    , toggleRiakCSTaskRequest: () => dispatch( riakCSActions.toggleRiakCSTaskRequest() )
    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Distributed );
