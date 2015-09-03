// System Settings
// ===============
// Display and Modify FreeNAS GUI and OS settings.

"use strict";

import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import _ from "lodash";

import SM from "../../../flux/middleware/SystemMiddleware";
import SS from "../../../flux/stores/SystemStore";

import HardwareSettings from "./System/HardwareSettings";
import LocalizationSettings from "./System/LocalizationSettings";
import OSSettings from "./System/OSSettings";
import Tuneables from "./System/Tuneables";
import WebappSettings from "./System/WebappSettings";

function getSystemUIConfig () {
  return SS.systemUIConfig;
}

const System = React.createClass(
  { render () {
    return (
      <Grid>
        <Row>
          <Col xs = {4}>
            <WebappSettings/>
          </Col>
          <Col xs = {4}>
            <OSSettings/>
          </Col>
          <Col xs = {4}>
            <LocalizationSettings/>
          </Col>
        </Row>
        <Row>
          <Col xs = {4}>
            <HardwareSettings/>
          </Col>
          <Col xs = {8}>
            <Tuneables/>
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default System;
