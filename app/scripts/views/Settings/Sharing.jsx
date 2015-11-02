// Sharing Service Settings
// ========================
// Settings for services directly related to shares: SMB, NFS, AFP, WebDAV, FTP, TFTP

"use strict";

import React from "react";
import { Col } from "react-bootstrap";
import { connect } from "react-redux";

import * as smbActions from "../../actions/smb";
import * as nfsActions from "../../actions/nfs";
import * as afpActions from "../../actions/afp";
import * as SUBSCRIPTIONS from "../../actions/subscriptions";

import SMB from "./Sharing/SMB";
import NFS from "./Sharing/NFS";
import AFP from "./Sharing/AFP";
import WebDAV from "./Sharing/WebDAV";
import FTP from "./Sharing/FTP";
import TFTP from "./Sharing/TFTP";

class Sharing extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "Sharing Settings";
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
          <SMB { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <NFS { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <AFP { ...this.props }/>
        </Col>
        {/*<Col xs = {4}>
          <FTP { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <WebDAV { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <TFTP { ...this.props }/>
        </Col>*/}
      </div>
    );
  }
};

// REDUX
function mapStateToProps ( state ) {
  return ( { smbServerState: state.smb.smbServerState
           , smbForm: state.smb.smbForm
           , nfsServerState: state.nfs.nfsServerState
           , nfsForm: state.nfs.nfsForm
           , afpServerState: state.afp.afpServerState
           , afpForm: state.afp.afpForm
           }
         );
}

const SUB_MASKS = [ "entity-subscriber.services.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (

    { subscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    // FORMS
    , updateSMBForm: ( field, value ) =>
        dispatch( smbActions.updateSMBForm( field, value ) )
    , resetSMBForm: () => dispatch( smbActions.resetSMBForm() )
    , updateNFSForm: ( field, value ) =>
        dispatch( nfsActions.updateNFSForm( field, value ) )
    , resetNFSForm: () => dispatch( nfsActions.resetNFSForm() )
    , updateAFPForm: ( field, value ) =>
        dispatch( afpActions.updateAFPForm( field, value ) )
    , resetAFPForm: () => dispatch( afpActions.resetAFPForm() )

    // QUERIES
    , fetchData: () => {
      dispatch( smbActions.requestSMBConfig() );
      dispatch( nfsActions.requestNFSConfig() );
      dispatch( afpActions.requestAFPConfig() );
    }

    // TASKS
    , configureSMBTaskRequest: () =>
        dispatch( smbActions.configureSMBTaskRequest() )
    , toggleSMBTaskRequest: () => dispatch( smbActions.toggleSMBTaskRequest() )
    , configureNFSTaskRequest: () =>
        dispatch( nfsActions.configureNFSTaskRequest() )
    , toggleNFSTaskRequest: () => dispatch( nfsActions.toggleNFSTaskRequest() )
    , toggleNFSv4TaskRequest: () =>
        dispatch( nfsActions.toggleNFSv4TaskRequest() )
    , configureAFPTaskRequest: () =>
        dispatch( afpActions.configureAFPTaskRequest() )
    , toggleAFPTaskRequest: () => dispatch( afpActions.toggleAFPTaskRequest() )

    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sharing );
