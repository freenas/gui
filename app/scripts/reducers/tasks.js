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
  let { userSubmitted, userActive } = state;

  switch ( type ) {

  // TASK SUBMISSION HANDLERS
  // ========================

    // SUBMIT TASK - ORIGINAL REQUEST
    // ==============================
    // Record the arguments for the task, and wait for the success callback
    // to resolve and remove the key.
    case actionTypes.TASK_SUBMIT_REQUEST:

      userSubmitted[ payload.UUID ] = payload.args;

      return Object.assign( {}, state, { userSubmitted } );


    // SUBMIT TASK - SUCCESS
    // =====================
    // Move the arguments to userActive and re-key by task ID, then delete
    // the original key in userSubmitted.
    case actionTypes.TASK_SUBMIT_SUCCESS:

      userActive[ payload.taskID ] = userSubmitted[ payload.UUID ];
      delete userSubmitted[ payload.UUID ];

      return Object.assign( {}, state, { userSubmitted, userActive } );


    // SUBMIT TASK - FAILURE
    // =====================
    // This case is only triggered when the actual submission encounters an
    // error. Either there's a bug in the middleware itself, or (much more
    // likely) the task name or args were malformed.
    case actionTypes.TASK_SUBMIT_FAILURE:

      delete userSubmitted[ payload.UUID ];

      return Object.assign( {}, state, { userSubmitted } );

    default:
      return state;

  }
}
