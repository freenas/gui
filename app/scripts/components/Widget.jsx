// Widget
// ======
// Display component for dashboard widgets.

"use strict";

import React from "react";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Widget.less" );


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
      let toolbar = null;

      if ( this.props.className ) {
        classes.push( this.props.className.split( /\s/ ) );
      }

      if ( this.props.title ) {
        toolbar = (
          <div className = "widget-toolbar">
            <span className = "widget-name">{ this.props.title }</span>
          </div>
        );
      }

      return (
        <div className = { classes.join( " " ) }>
          { toolbar }
          { this.props.children }
        </div>
      );
    }
  }
);

export default Widget;

