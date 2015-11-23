// Clustered Sharing Service Settings
// ====================================
// Settings for clustered sharing services: IPVS, riak, riakcs

"use strict";

import React from "react";
import { Col } from "react-bootstrap";
import { connect } from "react-redux";

import * as ipfsActions from "../../actions/ipfs";
import * as riakActions from "../../actions/riak";
import * as riakCSActions from "../../actions/riakcs";
import * as stanchionActions from "../../actions/stanchion";
import * as glusterActions from "../../actions/gluster";
import * as swiftActions from "../../actions/swift";

import * as SUBSCRIPTIONS from "../../actions/subscriptions";

import IPFS from "./Clustered/IPFS";
import Riak from "./Clustered/Riak";
import RiakCS from "./Clustered/RiakCS";
import Stanchion from "./Clustered/Stanchion";
import Gluster from "./Clustered/Gluster";
import Swift from "./Clustered/Swift";

class Clustered extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "Clustered Services Settings";
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
          <Riak { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <RiakCS { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <Stanchion { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <IPFS { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <Gluster { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <Swift { ...this.props }/>
        </Col>
      </div>
    );
  }
};

function mapStateToProps ( state ) {
  return ( { ipfsServerState: state.ipfs.ipfsServerState
           , ipfsForm: state.ipfs.ipfsForm
           , riakServerState: state.riak.riakServerState
           , riakForm: state.riak.riakForm
           , riakCSServerState: state.riakcs.riakCSServerState
           , riakCSForm: state.riakcs.riakCSForm
           , stanchionServerState: state.stanchion.stanchionServerState
           , stanchionForm: state.stanchion.stanchionForm
           , glusterServerState: state.gluster.glusterServerState
           , glusterForm: state.gluster.glusterForm
           , swiftServerState: state.swift.swiftServerState
           , swiftForm: state.swift.swiftForm
           }
         );
};

const SUB_MASKS = [ "entity-subscriber.service.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (
    // SUBSCRIPTIONS
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
    , updateStanchionForm: ( field, value ) =>
      dispatch( stanchionActions.updateStanchionForm( field, value ) )
    , resetStanchionForm: () =>
      dispatch( stanchionActions.resetStanchionForm() )
    , updateGlusterForm: ( field, value ) =>
      dispatch( glusterActions.updateGlusterForm( field, value ) )
    , resetGlusterForm: () =>
      dispatch( glusterActions.resetGlusterForm() )
    , updateSwiftForm: ( field, value ) =>
      dispatch( swiftActions.updateSwiftForm( field, value ) )
    , resetSwiftForm: () => dispatch( swiftActions.resetSwiftForm() )

    // QUERIES
    , fetchData: () => {
      dispatch( ipfsActions.requestIPFSConfig() );
      dispatch( riakActions.requestRiakConfig() );
      dispatch( riakCSActions.requestRiakCSConfig() );
      dispatch( stanchionActions.requestStanchionConfig() );
      dispatch( glusterActions.requestGlusterConfig() );
      dispatch( swiftActions.requestSwiftConfig() );
    }

    // TASKS
    , configureIPFSTaskRequest: () =>
      dispatch( ipfsActions.configureIPFSTaskRequest() )
    , toggleIPFSTaskRequest: () =>
      dispatch( ipfsActions.toggleIPFSTaskRequest() )
    , configureRiakTaskRequest: () =>
      dispatch( riakActions.configureRiakTaskRequest() )
    , toggleRiakTaskRequest: () =>
      dispatch( riakActions.toggleRiakTaskRequest() )
    , configureRiakCSTaskRequest: () =>
      dispatch( riakCSActions.configureRiakCSTaskRequest() )
    , toggleRiakCSTaskRequest: () =>
      dispatch( riakCSActions.toggleRiakCSTaskRequest() )
    , configureStanchionTaskRequest: () =>
      dispatch( stanchionActions.configureStanchionTaskRequest() )
    , toggleStanchionTaskRequest: () =>
      dispatch( stanchionActions.toggleStanchionTaskRequest() )
    , configureGlusterTaskRequest: () =>
      dispatch( glusterActions.configureGlusterTaskRequest() )
    , toggleGlusterTaskRequest: () =>
      dispatch( glusterActions.toggleGlusterTaskRequest() )
    , configureSwiftTaskRequest: () =>
      dispatch( swiftActions.configureSwiftTaskRequest() )
    , toggleSwiftTaskRequest: () =>
      dispatch( swiftActions.toggleSwiftTaskRequest() )
    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Clustered );
