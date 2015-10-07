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
var _subtasks  = {};

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

  getTasksByName ( name ) {
    let tasks = Object.assign( {}, _created, _waiting, _executing, _finished
                             , _failed, _aborted );

    return _.where( tasks, { name: name }) || [];
  }

  getTaskByID ( ID ) {
    let allTasks = [ _created, _waiting, _executing, _finished, _failed
                   , _aborted ];
    return _.find( allTasks, function ( task ) {
      return task.id === ID;
    });
  }

  // returns all subtasks of the provided taskID
  getSubtasks ( taskID ) {
    return _subtasks[ taskID ];
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

    case ActionTypes.RECEIVE_SUBTASKS:
      _subtasks[ action.taskID ] = action.subtasks;
      break;

    case ActionTypes.MIDDLEWARE_EVENT:
      const NAME = action.eventData.args.name;
      const ARGS = action.eventData.args.args;

      if ( NAME.indexOf( "task." ) !== -1 ) {
        var CREATED   = _created[ ARGS.id ]   || {};
        var WAITING   = _waiting[ ARGS.id ]   || {};
        var EXECUTING = _executing[ ARGS.id ] || {};
        let perct = 0;

        switch ( NAME ) {
          case "task.created":
            _created[ ARGS.id ] = ARGS;
            break;

          case "task.progress":
            switch ( ARGS.state ) {

              case "WAITING":
                _waiting[ ARGS.id ] =
                  _.merge( CREATED
                         , ARGS );

                delete _created[ ARGS.id ];
                break;

              case "EXECUTING":
                _executing[ ARGS.id ] =
                  _.merge( CREATED
                         , WAITING
                         , ARGS );

                delete _created[ ARGS.id ];
                delete _waiting[ ARGS.id ];
                break;

              case "FINISHED":
                _finished[ ARGS.id ] =
                  _.merge( CREATED
                         , WAITING
                         , EXECUTING
                         , ARGS
                         , { percentage: 100 } );

                delete _created[ ARGS.id ];
                delete _waiting[ ARGS.id ];
                delete _executing[ ARGS.id ];
                break;

              case "ABORTED":
                perct = ARGS.percentage === 0
                      ? 50
                      : ARGS.percentage;
                _aborted[ ARGS.id ] =
                  _.merge( CREATED
                         , WAITING
                         , EXECUTING
                         , ARGS
                         , { percentage: perct } );
                delete _created[ ARGS.id ];
                delete _waiting[ ARGS.id ];
                delete _executing[ ARGS.id ];
                break;

              case "FAILED":
                perct = ARGS.percentage === 0
                      ? 50
                      : ARGS.percentage;
                _failed[ ARGS.id ] =
                  _.merge( CREATED
                         , WAITING
                         , EXECUTING
                         , ARGS
                         , { percentage: perct } );
                delete _created[ ARGS.id ];
                delete _waiting[ ARGS.id ];
                delete _executing[ ARGS.id ];
                break;
            }

            break;
        }

        this.emitChange( ARGS.name );
      }
      break;

    default:
    // No action
  }
}

export default new TasksStore();
