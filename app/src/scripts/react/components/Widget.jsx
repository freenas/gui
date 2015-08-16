// Widget
// ======
// Display component for dashboard widgets.

"use strict";

import React from "react";
import _ from "lodash";

const Widget = React.createClass(

  { propTypes: { size: React.PropTypes.string.isRequired }

  , render: function () {

    return (
      <div className = { "widget " + this.props.size }>
        <header>
          <span className = "widgetTitle">
            { this.props.title }
          </span>
        </header>
        <div className = "widget-content" >
          { this.props.children }
        </div>
      </div>

    );
  }
});

export default Widget;

