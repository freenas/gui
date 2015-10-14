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
      if ( this.isMounted() && this.dynamicPathIsActive() ) {
        var currentRoutes = this.context.router.getCurrentRoutes();
        var currentIndex = _.findIndex( currentRoutes, function ( routeData ) {
          return _.contains( routeData["paramNames"], this.props.routeParam );
        }, this );

        this.context.router.transitionTo(
          currentRoutes[ currentIndex - 1 ]["path"]
        );
      }
    }

};

export default ViewerCommon;
