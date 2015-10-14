// COMMON VIEWER MODE MIXIN
// ========================
// This mixin contains useful methods that apply to cross-cutting concerns in
// the various different viewer modes.

"use strict";

import _ from "lodash";
import React from "react";

const ViewerCommon =

  { dynamicPathIsActive: function () {
      return typeof this.props.params[ this.props.routeParam ] === "string";
    }

  , returnToViewerRoot: function () {
      var newPath =
        this.context.location.pathname.replace( "/"
                                      + this.props.params[ this.props.routeParam ]
                                      , "" );
      this.history.pushState( null, newPath );
    }
  };

export default ViewerCommon;
