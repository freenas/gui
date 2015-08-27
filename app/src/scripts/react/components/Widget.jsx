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
      return (
        <div className = "widget">
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

