// Groups Middleware
// ================
// Handle the lifecycle and event hooks for the Groups channel of the middleware

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";

import GAC from "..//actions/GroupsActionCreators";

class GroupsMiddleware extends AbstractBase {

  static subscribe ( componentID ) {
    MC.subscribe( [ "groups.changed"
                  , "entity-subscriber.groups.changed"
                  , "task.progress"
                  ]
                , componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "groups.changed"
                    , "entity-subscriber.groups.changed"
                    , "task.progress"
                    ]
                  , componentID );
  }

  static requestGroupsList () {
    MC.request( "groups.query"
              , []
              , GAC.receiveGroupsList
              );
  }

  static createGroup ( newGroupProps ) {
    MC.request( "task.submit"
              , [ "groups.create" , [ newGroupProps ] ]
              , GAC.receiveGroupUpdateTask
              );
  }

  static updateGroup ( groupID, props ) {
    MC.request( "task.submit"
              , [ "groups.update", [ groupID, props ] ]
              , GAC.receiveGroupUpdateTask.bind( null, groupID )
              );
  }

  static deleteGroup ( groupID ) {
    MC.request( "task.submit"
              , [ "groups.delete", [ groupID ] ]
              , GAC.receiveGroupUpdateTask.bind( null, groupID )
              );
  }

};

export default GroupsMiddleware;
