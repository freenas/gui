// Calendar Middleware
// ========================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import MiddlewareAbstract from "./MIDDLEWARE_BASE_CLASS";
import CAC from "../actions/CalendarActionCreators";

class CalendarMiddleware extends MiddlewareAbstract {

  static subscribe ( componentId ) {
    MC.subscribe( []
                , componentId
                );
  }

  static unsubscribe ( componentId ) {
    MC.unsubscribe( []
                , componentId
                );
  }

  static requestCalendar () {
    MC.request( "calendar_tasks.query"
              , []
              , CAC.receiveCalendar
              );
  }

  static createCalendarTask ( newTask ) {
    MC.request( "task.submit"
              , [ "calendar_tasks.create", [ newTask ] ]
              , CAC.receiveCalendarUpdateTask
              );
  }

  static updateCalendarTask ( taskID, newTask ) {
    MC.request( "task.submit"
              , [ "calendar_tasks.update", [ taskId, newTask ] ]
              , CAC.receiveCalendarUpdateTask
              );
  }

  static deleteCalendarTask ( taskID ) {
    MC.request( "task.submit"
              , [ "calendar_tasks.delete", [ taskID ] ]
              , CAC.receiveCalendarUpdateTask
              );
  }
}

export default CalendarMiddleware;
