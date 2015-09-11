// Calendar Action Creators
// =============================

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";

class CalendarActionCreators {

  static receiveCalendar ( calendar, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_CALENDAR
      , timestamp
      , calendar
      }
    );
  }

  // 'newTaskID' refers to the task that was scheduled. 'taskID' refers to the
  // task that was dispatched to schedule the task. Sorry =<
  static receiveCalendarUpdateTask ( newTaskID, taskID, timestamp ) {
    FreeNASDispatcher.handleMiddlewareAction(
      { type: ActionTypes.RECEIVE_CALENDAR_UPDATE_TASK
      , timestamp
      , taskID
      , newTaskID
      }
    );
  }
}

export default CalendarActionCreators;
