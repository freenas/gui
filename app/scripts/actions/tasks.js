// TASKS - ACTION CREATORS
// =======================

import * as actionTypes from "./actionTypes";
import freeNASUtil from "../utility/freeNASUtil";

"use strict";

export function taskSubmitRequest ( UUID, args ) {
  return (
    { type: actionTypes.TASK_SUBMIT_REQUEST
    , payload: { UUID, args }
    }
  );
}

export function taskSubmitSuccess ( UUID, taskID ) {
  return (
    { type: actionTypes.TASK_SUBMIT_REQUEST
    , payload: { UUID, taskID, timestamp }
    }
  );
}

export function taskSubmitFailure ( UUID, taskID ) {
  return (
    { type: actionTypes.TASK_SUBMIT_REQUEST
    , payload: { UUID, taskID, timestamp }
    }
  );
}

export function taskCreated ( data ) {
  return (
    { type: actionTypes.TASK_CREATED
    , payload: { data }
    }
  );
}

export function taskUpdated ( data ) {
  return (
    { type: actionTypes.TASK_UPDATED
    , payload: { data }
    }
  );
}

export function taskProgress ( data ) {
  return (
    { type: actionTypes.TASK_PROGRESS
    , payload: { data }
    }
  );
}

export function taskFinished ( data ) {
  return (
    { type: actionTypes.TASK_FINISHED
    , payload: { data }
    }
  );
}

export function taskFailed ( data ) {
  return (
    { type: actionTypes.TASK_FAILED
    , payload: { data }
    }
  );
}
