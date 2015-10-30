// Sharing Service Settings
// ========================
// Settings for services directly related to shares: SMB, NFS, AFP, WebDAV, FTP, TFTP

"use strict";

import React from "react";
import { Col } from "react-bootstrap";

import SMB from "./Sharing/SMB";
import NFS from "./Sharing/NFS";
import AFP from "./Sharing/AFP";
import WebDAV from "./Sharing/WebDAV";
import FTP from "./Sharing/FTP";
import TFTP from "./Sharing/TFTP";

export default class Sharing extends React.Component {
  constructor ( props ) {
    super( props );
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
