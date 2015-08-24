// Widget
// ======
// Display component for dashboard widgets.

"use strict";

import React from "react";

const Widget = React.createClass(

  { render () {

    return (
      <div className = { "widget" }>
        { this.props.children }
      </div>
    );
  }
});

export default Widget;

