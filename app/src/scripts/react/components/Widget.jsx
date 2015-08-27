// Widget
// ======
// Display component for dashboard widgets.

"use strict";

import React from "react";

const Widget = React.createClass(
  { propTypes:
    { title: React.PropTypes.string
    }

  , getDefaultProps () {
      return { title: ""
             };
    }

  , render () {
      let classes = [ "widget" ];

      if ( this.props.className ) {
        classes.push( this.props.className.split( /\s/ ) );
      }

      return (
        <div className = { classes.join( " " ) }>
          <div className = "widget-toolbar">
            <span className = "widget-name">{ this.props.title }</span>
          </div>
          { this.props.children }
        </div>
      );
    }
  }
);

export default Widget;

