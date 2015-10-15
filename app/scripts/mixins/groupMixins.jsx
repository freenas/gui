// Group Editing Mixins
// ====================
// Groups-specific shared editing functions.
// TODO: Move anything in this and usersMixins that can be shared outside of the
// Accounts view into a more general mixin.

"use strict";

import _ from "lodash";

import GroupsStore from "../flux/stores/GroupsStore";
import GroupsMiddleware from "../flux/middleware/GroupsMiddleware";

import viewerCommon from "../components/Viewer/mixins/viewerCommon";

module.exports = {
  deleteGroup: function () {
    GroupsMiddleware.deleteGroup(
      this.props.item.id
    , function leaveGroupItem () {
      let newPath =
        this.context.location.pathname.replace( "/"
                                              + this.props.params[ this.props.routeParam ]
                                              , ""
                                              );
      this.history.pushState( null, newPath );
    } );
  }
};
