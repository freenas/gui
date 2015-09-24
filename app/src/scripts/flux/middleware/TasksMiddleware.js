// Tasks Middleware
// ================
// Handle the lifecycle and event hooks for the tasks namespace

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";
import { TASKS as TASKS_LIMIT } from "../constants/StoreLimits";

import TAC from "../actions/TasksActionCreators";

class TasksMiddleware extends AbstractBase {

  static subscribe ( componentID ) {
    MC.subscribe( [ "task.*" ], componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "task.*" ], componentID );
  }

  static requestAllTasks () {
    MC.request( "task.query"
              , []
              , TAC.receiveTaskHistory
              );
  }

  static getSubtasks ( taskID ) {
    MC.request( "task.query"
              , [ [[ "parent", "=", "taskID" ]]
                , { sort: "id" }
                ]
              , TAC.receiveSubtasks.bind( TAC, taskID )
              );
  }

  static getCompletedTaskHistory ( callback ) {
    // TODO: This MUST go through the Flux pattern, and needs to be limited
    // by the value set in StoreLimits
    return MC.request( "task.query"
                     , [ [[ "state", "~", "FINISHED|ABORTED|FAILED" ]]
                       , { limit: TASKS_LIMIT
                         , sort: "-id"
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
