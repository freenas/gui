// Tasks Middleware
// ================
// Handle the lifecycle and event hooks for the tasks namespace

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";


class TasksMiddleware extends AbstractBase {

  static subscribe ( componentID ) {
    MC.subscribe( [ "task.*" ], componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "task.*" ], componentID );
  }

  static getCompletedTaskHistory ( callback, offset ) {
    // TODO: This MUST go through the Flux pattern, and needs to be limited
    // by the value set in StoreLimits
    return MC.request( "task.query"
                     , [ [[ "state", "~", "FINISHED|ABORTED|FAILED" ]]
                       , { offset: ( offset || 0 )
                         , limit: 100
                         , sort: "id"
                         , dir: "desc"
                         }
                       ]
                     , callback
                     );
  }

  static abortTask ( taskID ) {
    MC.request( "task.abort", [ parseInt( taskID, 10 ) ] );
  }
};

export default TasksMiddleware;
