// TASKS - REDUCER
// ===============

"use strict";

import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE =
  // userSubmitted stores the UUID and original arguments supplied by the user.
  // Keyed by UUID
  { userSubmitted: {}
  // userActive stores the ID of a task submitted in the current session, as
  // well as the original arguments from userSubmitted.
  // Keyed by task ID
  , userActive: {}
  // tasks is a normalized collection of all tasks
  // Keyed by task ID
  , tasks: {}
  };

export default function tasks ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;
  let userSubmitted;
  let userActive;
  let tasks;

  switch ( type ) {

  // TASK SUBMISSION HANDLERS
  // ========================

    // SUBMIT TASK - ORIGINAL REQUEST
    // ==============================
    // Record the arguments for the task, and wait for the success callback
    // to resolve and remove the key.
    case actionTypes.TASK_SUBMIT_REQUEST:
      userSubmitted = Object.assign( {}
                                   , state.userSubmitted
                                   , { [ payload.UUID ]: payload.args }
                                   );

      return Object.assign( {}, state, { userSubmitted } );


    // SUBMIT TASK - SUCCESS
    // =====================
    // Move the arguments to userActive and re-key by task ID, then delete
    // the original key in userSubmitted.
    case actionTypes.TASK_SUBMIT_SUCCESS:
      userSubmitted = Object.assign( {}, state.userSubmitted );
      userActive = Object.assign( {}
                                , state.userActive
                                , { [ payload.taskID ]: userSubmitted[ payload.UUID ] }
                                );

      delete userSubmitted[ payload.UUID ];

      return Object.assign( {}, state, { userSubmitted, userActive } );


    // SUBMIT TASK - FAILURE
    // =====================
    // This case is only triggered when the actual submission encounters an
    // error. Either there's a bug in the middleware itself, or (much more
    // likely) the task name or args were malformed.
    case actionTypes.TASK_SUBMIT_FAILURE:
      userSubmitted = Object.assign( {}, state.userSubmitted );

      delete userSubmitted[ payload.UUID ];

      return Object.assign( {}, state, { userSubmitted } );


    case actionTypes.TASK_CREATED:
    case actionTypes.TASK_UPDATED:
    case actionTypes.TASK_PROGRESS:
    case actionTypes.TASK_FINISHED:
    case actionTypes.TASK_FAILED:
      tasks = Object.assign( {}, state.tasks );

      if ( tasks[ payload.data.id ] ) {
        tasks[ payload.data.id ] =
          Object.assign( tasks[ payload.data.id ], payload.data );
      } else {
        tasks[ payload.data.id ] = payload.data;
      }

      return Object.assign( {}, state, { tasks } );

    default:
      return state;

  }
}
