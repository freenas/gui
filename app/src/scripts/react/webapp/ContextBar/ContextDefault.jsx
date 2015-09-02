// OVERVIEW BAR NAVIGATION
// ========================

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

import Icon from "../../components/Icon";

const ContextDefault = React.createClass(
  { render () {
      return (
        <TWBS.Nav
          bsStyle = "tabs"
          activeKey = {1}
          onSelect = { this.handleSelect }
          justified
        >
          <TWBS.NavItem eventKey={1}>
            <Icon glyph="icon-comment-alt" />
          </TWBS.NavItem>
          <TWBS.NavItem eventKey={2}>
            <Icon glyph="icon-comment-alt" />
          </TWBS.NavItem>
          <TWBS.NavItem eventKey={3}>
            <Icon glyph="icon-clipboard" />
          </TWBS.NavItem>
        </TWBS.Nav>
      );
    }

  }
);

export default ContextDefault;
