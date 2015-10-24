// User Editing Mixins
// ===================
// Various things that are needed for just
// about any view that will be editing users.

"use strict";

import _ from "lodash";

import UsersStore from "../flux/stores/UsersStore";
import UsersMiddleware from "../flux/middleware/UsersMiddleware";

import viewerCommon from "../components/Viewer/mixins/viewerCommon";

module.exports = (
  { // Converts an array of strings into an array of integers. Intended solely
    // for use when submitting groups lists to the middleware.
    parseGroupsArray: function ( groupsArray ) {
      var integerArray = [];

      integerArray = _.map( groupsArray, function ( group ) {
        return _.parseInt( group );
      }, this );

      return integerArray;
    }

  , deleteUser: function () {
      UsersMiddleware.deleteUser(
        this.props.item.id
      , function leaveUserItem () {
        let newPath =
          this.context.location.pathname.replace( "/"
                                                + this.props.params[ this.props.routeParam ]
                                                , ""
                                                );
        this.history.pushState( null, newPath );
      } );
    }
  }
);
