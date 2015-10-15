// Security Settings
// =================
// FreeNAS system settings relating to security, including Certificates and
// Certificate Authorities.

"use strict";

import React from "react";
import { Col } from "react-bootstrap";

import SSH from "./Security/SSH";

const Security = React.createClass(
  { render () {
    return (
      <div className="view-content">
        <section>
          <Col xs = {4}>
            <SSH />
          </Col>
        </section>
      </div>
    );
  }
});

export default Security;
