// Calendar Store
// ====================

"use strict";

import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var _tasks = [];

class CalendarStore extends FluxBase {
  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get tasks () {
    return _tasks;
  }

  getTaskByID ( id ) {
    return _.find( _tasks, { id: id } );
  }

  getTasksOfType ( typeName ) {
    return _.select( _tasks
                   , function checkTaskType ( task ) {
                     return task.name === typeName;
                   }
                   );
  }
}

function handlePayload( payload ) {
  const ACTION = payload.action;
  const eventData = ACTION.eventData;

  switch ( ACTION.type ) {

    case ActionTypes.RECEIVE_CALENDAR:
      _tasks = ACTION.calendar;
      this.emitChange();
      break;

    // To be used for displaying processing overlay
    case ActionTypes.RECEIVE_CALENDAR_UPDATE_TASK:
      break;

    // Blocked until calendar tasks emit events
    case ActionTypes.MIDDLEWARE_EVENT:
      let args = eventData.args;
      break;
  }
}

export default new CalendarStore();
