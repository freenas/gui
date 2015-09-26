// VOLUME SECTION NAV
// ==================
// Simple tablular navigation for controlling the content of Volume's drawer

"use strict";

import React from "react";
import { Nav, NavItem } from "react-bootstrap";

export default class VolumeSectionNav extends React.Component {
  render () {
    return (
      <Nav
        className = "volume-nav"
        bsStyle   = "pills"
        activeKey = { this.props.activeKey }
        onSelect  = { this.props.onSelect }
      >
        <NavItem disabled> {/* FIXME */}
          {"Files"}
          </NavItem>
        <NavItem eventKey="filesystem">
          {"Shares"}
        </NavItem>
        <NavItem disabled> {/* FIXME */}
          {"Snapshots"}
        </NavItem>
        <NavItem eventKey="disks">
          {"Topology"}
        </NavItem>
      </Nav>
    );
  }
}

VolumeSectionNav.propTypes =
  { activeKey: React.PropTypes.any
  , onSelect: React.PropTypes.func.isRequired
  };
