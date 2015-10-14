// FONT ICON
// =========
// Generates a font-based icon

"use strict";

import React from "react";

const Icon = React.createClass(
  { propTypes:
    { glyph: React.PropTypes.string.isRequired
    , className: React.PropTypes.string
    , style: React.PropTypes.object
    }

  , render () {
      let iconClass = [ "icon" ];

      if ( this.props.glyph ) {
        iconClass.push( this.props.glyph );
      }

      if ( this.props.className ) {
        iconClass.push( this.props.className.split( /\s/ ) );
      }

      return (
        <span
          onClick   = { this.props.onClick }
          className = { iconClass.join( " " ) }
          style     = { this.props.style }
        />
      );
    }
  }
);

export default Icon;
