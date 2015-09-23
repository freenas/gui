// Generic Disclosure Triangle based React Components
// ===============================
// General purpose disclosure Triangles, they can be used to show/hide any
// data(paragraphs/lists/Twitter Bootstrap panels (TWBS.panel) ,etc)

"use strict";

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
             };
    }

  , getInitialState () {
      return { expanded: this.props.defaultExpanded || true };
    }

  , render () {
      const { children, headerShow, headerHide, ...other } = this.props;
      let text, iconGlyph, containerClass;

      if ( this.state.expanded ) {
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
            onClick = { ( event ) => {
              this.setState( { expanded: !this.state.expanded } );
            }}
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
