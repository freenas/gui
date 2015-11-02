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
import * as stanchionActions from "../../actions/stanchion";
import * as glusterActions from "../../actions/gluster";

import * as SUBSCRIPTIONS from "../../actions/subscriptions";

import IPFS from "./Distributed/IPFS";
import Riak from "./Distributed/Riak";
import RiakCS from "./Distributed/RiakCS";
import Stanchion from "./Distributed/Stanchion";
import Gluster from "./Distributed/Gluster";

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
           }
         );
};

const SUB_MASKS = [ "entity-subscriber.services.changed" ];

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

    // QUERIES
    , fetchData: () => {
      dispatch( ipfsActions.requestIPFSConfig() );
      dispatch( riakActions.requestRiakConfig() );
      dispatch( riakCSActions.requestRiakCSConfig() );
      dispatch( stanchionActions.requestStanchionConfig() );
      dispatch( glusterActions.requestGlusterConfig() );
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
    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Distributed );
