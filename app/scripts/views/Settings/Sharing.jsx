// Sharing Service Settings
// ========================
// Settings for services directly related to shares: SMB, NFS, AFP, WebDAV, FTP, TFTP

"use strict";

import React from "react";
import { Col } from "react-bootstrap";
import { connect } from "react-redux";

import * as smbActions from "../../actions/smb";
import * as nfsActions from "../../actions/nfs";
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

    this.displayName = "SharingSettings"
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
        {/*<Col xs = {4}>
          <FTP { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <NFS { ...this.props }/>
        </Col>
        <Col xs = {4}>
          <AFP { ...this.props }/>
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
  return ( { smbServerState:
             { enable: state.smb.smbServerState.enable
             , dos_charset: state.smb.smbServerState.dos_charset
             , filemask: state.smb.smbServerState.filemask
             , unix_charset: state.smb.smbServerState.unix_charset
             , domain_logons: state.smb.smbServerState.domain_logons
             , max_protocol: state.smb.smbServerState.max_protocol
             , netbiosname: state.smb.smbServerState.netbiosname
             , empty_password: state.smb.smbServerState.empty_password
             , dirmask: state.smb.smbServerState.dirmask
             , description: state.smb.smbServerState.description
             , log_level: state.smb.smbServerState.log_level
             , min_protocol: state.smb.smbServerState.min_protocol
             , obey_pam_restrictions: state.smb.smbServerState.obey_pam_restrictions
             , workgroup: state.smb.smbServerState.workgroup
             , time_server: state.smb.smbServerState.time_server
             , guest_user: state.smb.smbServerState.guest_user
             , local_master: state.smb.smbServerState.local_master
             , hostlookup: state.smb.smbServerState.hostlookup
             , syslog: state.smb.smbServerState.syslog
             , zeroconf: state.smb.smbServerState.zeroconf
             , execute_always: state.smb.smbServerState.execute_always
             , unixext: state.smb.smbServerState.unixext
             , bind_addresses: state.smb.smbServerState.bind_addresses
             }
           , smbForm: state.smb.smbForm
           , nfsServerState:
             { enable: state.nfs.nfsServerState.enable
             , udp: state.nfs.nfsServerState.udp
             , v4: state.nfs.nfsServerState.v4
             , v4_kerberos: state.nfs.nfsServerState.v4_kerberos
             , mountd_port: state.nfs.nfsServerState.mountd_port
             , bind_addresses: state.nfs.nfsServerState.bind_addresses
             , rpclockd_port: state.nfs.nfsServerState.rpclockd_port
             , rpcstatd_port: state.nfs.nfsServerState.rpcstatd_port
             , nonroot: state.nfs.nfsServerState.nonroot
             , servers: state.nfs.nfsServerState.servers
             }
           , nfsForm: state.nfs.nfsForm
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

    // QUERIES
    , fetchData: () => {
      dispatch( smbActions.requestSMBConfig() );
      dispatch( nfsActions.requestNFSConfig() );
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

    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sharing );
