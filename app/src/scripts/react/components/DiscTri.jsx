// Generic Disclosure Triangle based React Components
// ===============================
// General purpose disclosure Triangles, they can be used to show/hide any
// data(paragraphs/lists/Twitter Bootstrap panels (TWBS.panel) ,etc)

"use strict";

import _ from "lodash";
import React from "react";

// Icons
import Icon from "./Icon";

var DiscTri = React.createClass(

  { propTypes:
    { headerShow      : React.PropTypes.string
    , headerHide      : React.PropTypes.string
    , defaultExpanded : React.PropTypes.bool
    }

  , getDefaultProps () {
      return { headerShow: "Hide"
             , headerHide: "Show"
             , expanded: true
             };
    }

  , toggleExpanded () {
    if ( _.has( this, [ "state", "expanded" ] ) ) {
      this.setState( { expanded: !this.state.expanded } );
    } else {
      this.setState( { expanded: !this.props.defaultExpanded } );
    }
  }

  , render () {
      const { children, headerShow, headerHide, ...other } = this.props;
      let text, iconGlyph, containerClass;

      if ( ( _.has( this, [ "state", "expanded" ] ) && this.state.expanded )
        || this.props.defaultExpanded
         ) {
        text = headerShow;
        iconGlyph = "arrow-triangle-down";
        containerClass = "disc-show";
      } else {
        text = headerHide;
        iconGlyph = "arrow-triangle-right";
        containerClass = "disc-hide";
      }

      return (
        <div
          { ...other }
          className = "disclosure-triangle"
        >
          <div
            className = "disc-title"
            onClick = { this.toggleExpanded }
          >
            <Icon glyph = { iconGlyph } />
            { text }
          </div>
          <div className = { containerClass } >
            { children }
          </div>
        </div>
      );
    }
  }
);

export default DiscTri;
