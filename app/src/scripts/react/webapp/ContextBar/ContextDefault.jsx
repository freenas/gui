// OVERVIEW BAR NAVIGATION
// ========================

"use strict";

import React from "react";
import { Nav, NavItem } from "react-bootstrap";

import Icon from "../../components/Icon";

const ContextDefault = React.createClass(
  { render () {
      return (
        <Nav
          bsStyle = "tabs"
          activeKey = {1}
          onSelect = { this.handleSelect }
          justified
        >
          <NavItem eventKey={1}>
            <Icon glyph="icon-datareport" />
          </NavItem>
          <NavItem eventKey={2}>
            <Icon glyph="icon-comment-alt" />
          </NavItem>
          <NavItem eventKey={3}>
            <Icon glyph="icon-clipboard" />
          </NavItem>
        </Nav>
      );
    }

  }
);

export default ContextDefault;
