// Tasks Flux Store
// ================
// Maintain log of tasks, and their respective status.

"use strict";

import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var CHANGE_EVENT = "change";

var _created   = {};
var _waiting   = {};
var _executing = {};
var _finished  = {};
var _failed    = {};
var _aborted   = {};

class TasksStore extends FluxBase {

  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get tasks () {
    return { CREATED: _created
           , WAITING: _waiting
           , EXECUTING: _executing
           , FINISHED: _finished
           , FAILED: _failed
           , ABORTED: _aborted
    };
  }

  get created () {
    return _created;
  }

  get waiting () {
    return _waiting;
  }

  get executing () {
    return _executing;
  }

  get finished () {
    return _finished;
  }

  get failed () {
    return _failed;
  }

  get aborted () {
    return _aborted;
  }

  getTaskByID ( ID ) {
    let allTasks = [ _created, _waiting, _executing, _finished, _failed
                   , _aborted ];
    return _.find( allTasks, function ( task ) {
      return task[ "id" ] === ID;
    });
  }

}

function handlePayload ( payload ) {
  var action = payload.action;
  const taskStatusDict =
    { CREATED: function populateCreated ( task ) {
                 newCreated[ task.id ] = task;
               }
    , WAITING: function populateWaiting ( task ) {
                 newWaiting[ task.id ] = task;
               }
    , EXECUTING: function populateExecuting ( task ) {
                   newExecuting[ task.id ] = task;
                 }
    , FINISHED: function populateFinished ( task ) {
                  newFinished[ task.id ] = task;
                }
    , FAILED: function populateFailed ( task ) {
                newFailed[ task.id ] = task;
              }
    , ABORTED: function populateAborted ( task ) {
                 newAborted[ task.id ] = task;
               }
    };

  switch ( action.type ) {
    case ActionTypes.RECEIVE_TASK_HISTORY:
      let newCreated = {};
      let newWaiting = {};
      let newExecuting = {};
      let newFinished = {};
      let newFailed = {};
      let newAborted = {};
      action.tasks.forEach( function populateTasks ( task ) {
        taskStatusDict[ task.state ]( task );
      });
      _created = newCreated;
      _waiting = newWaiting;
      _executing = newExecuting;
      _finished = newFinished;
      _failed = newFailed;
      _aborted = newAborted;
      this.emitChange( "allTasks" );
      break;


    case ActionTypes.MIDDLEWARE_EVENT:
      if ( action.eventData.args["name"].indexOf( "task." ) !== -1 ) {
        var taskArgs = action.eventData.args.args;
        var CREATED   = _created[ taskArgs["id"] ]   || {};
        var WAITING   = _waiting[ taskArgs["id"] ]   || {};
        var EXECUTING = _executing[ taskArgs["id"] ] || {};
        let perct = 0;

        switch ( action.eventData.args[ "name" ] ) {
          case "task.created":
            _created[ taskArgs[ "id" ] ] = taskArgs;
            break;

          case "task.progress":
          case "task.updated":
            switch ( taskArgs[ "state" ] ) {

              case "WAITING":
                _waiting[ taskArgs[ "id" ] ] =
                  _.merge( CREATED
                         , taskArgs );

                delete _created[ taskArgs[ "id" ] ];
                break;

              case "EXECUTING":
                _executing[ taskArgs[ "id" ] ] =
                  _.merge( CREATED
                         , WAITING
                         , taskArgs );

                delete _created[ taskArgs[ "id" ] ];
                delete _waiting[ taskArgs[ "id" ] ];
                break;

              case "FINISHED":
                _finished[ taskArgs[ "id" ] ] =
                  _.merge( CREATED
                         , WAITING
                         , EXECUTING
                         , taskArgs
                         , { percentage: 100 } );

                delete _created[ taskArgs[ "id" ] ];
                delete _waiting[ taskArgs[ "id" ] ];
                delete _executing[ taskArgs[ "id" ] ];
                break;

              case "ABORTED":
                perct = taskArgs[ "percentage" ] === 0 ? 50 :
                              taskArgs[ "percentage" ];
                _aborted[ taskArgs["id"] ] =
                  _.merge( CREATED
                         , WAITING
                         , EXECUTING
                         , taskArgs
                         , { percentage: perct } );
                delete _created[ taskArgs["id"] ];
                delete _waiting[ taskArgs["id"] ];
                delete _executing[ taskArgs["id"] ];
                break;

              case "FAILED":
                perct = taskArgs[ "percentage" ] === 0 ? 50 :
                              taskArgs[ "percentage" ];
                _failed[ taskArgs["id"] ] =
                  _.merge( CREATED
                         , WAITING
                         , EXECUTING
                         , taskArgs
                         , { percentage: perct } );
                delete _created[ taskArgs["id"] ];
                delete _waiting[ taskArgs["id"] ];
                delete _executing[ taskArgs["id"] ];
                break;
            }

            break;
        }

        this.emitChange( "taskEvent" );
      }
      break;

    default:
    // No action
  }
}

export default new TasksStore();
