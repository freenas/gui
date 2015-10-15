// Throbber
// ========

"use strict";

import React from "react";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Throbber.less" );


const Throbber = ({ bsStyle = "primary", size = 30, className = "" }) => {
  let classes = [ "throbber", "throbber-" + bsStyle, className ];

  return (
    <div className={ classes.join( " " ) }>
      <span
        className = "throbber-inner"
        style = {{ height: `${ size }px`, width: `${ size }px` }}
      />
    </div>
  );
}

Throbber.propTypes =
  { bsStyle: React.PropTypes.oneOf(
    [ "primary"
    , "info"
    , "danger"
    , "warning"
    , "success"
    ]
  )
  , size      : React.PropTypes.number
  , className : React.PropTypes.string
  };

export default Throbber;
