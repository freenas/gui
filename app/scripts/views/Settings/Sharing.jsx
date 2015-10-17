// Sharing Service Settings
// ========================
// Settings for services directly related to shares: CIFS, NFS, AFP, WebDav, FTP, TFTP

"use strict";

import React from "react";
import { Col } from "react-bootstrap";

import CIFS from "./Sharing/CIFS";
import NFS from "./Sharing/NFS";
import AFP from "./Sharing/AFP";
import WebDav from "./Sharing/WebDav";
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
          <FTP />
        </Col>
        <Col xs = {4}>
          <CIFS />
        </Col>
        <Col xs = {4}>
          <NFS />
        </Col>
        <Col xs = {4}>
          <AFP />
        </Col>
        <Col xs = {4}>
          <WebDav />
        </Col>
        <Col xs = {4}>
          <TFTP />
        </Col>
      </div>
    );
  }

};
