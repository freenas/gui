// Month
// =====
// A month for use in the Calendar view

"use strict";

import React from "react";
import _ from "lodash";

import moment from "moment";

import Day from "./Day";
import DropTarget from "../../components/DropTarget";

// Primitive and messy
function checkTaskDates ( tasks, date ) {
  var matchingTasks = [];
  _.forEach( tasks
           , function checkScheduleMatch ( task ) {

             var matchDay;
             if ( _.has( task.schedule, "day" ) ) {
               matchDay = task.schedule.day === date.getDate().toString()
                        ? true
                        : false;
             } else {
               matchDay = true;
             }

             var matchWeekday;
             if ( _.has( task.schedule, "day_of_week" ) ) {
               matchWeekday = task.schedule.day_of_week === date.getDay().toString()
                            ? true
                            : false;
             } else {
               matchWeekday = true;
             }

             // TODO: Figure out how 'week' works in the calendar_task schema
             // and check that too

             var matchMonth;
             if ( _.has( task.schedule, "month" ) ) {
               matchMonth = task.schedule.month === date.getMonth().toString()
                          ? true
                          : false;
             } else {
               matchMonth = true;
             }

             var matchYear;
             if ( _.has( task.schedule, "year" ) ) {
               matchYear = task.schedule.year === date.getYear().toString()
                         ? true
                         : false;
             } else {
               matchYear = true;
             }

             if ( matchDay
               && matchWeekday
               // && matchWeek
               && matchMonth
               && matchYear ) {
               matchingTasks.push( task );
             }
           }
           );
  return matchingTasks;
}

const Month = React.createClass(
  { getDefaultProps () {
    return { tasks: []
           , activeMonth: moment().month()
           , selectedDay: moment().date()
           };
  }

  , createBlankDays ( number ) {
    let result = [];

    for ( let i = 0; i < number; i++ ) {
      result.push(
        <div
          key={ i }
          className="day">
          <span className="day-content day-blank"></span>
        </div>
      );
    }

    return result;
  }

  , createDays ( ) {
    const today = moment();
    const activeDate = moment().month( this.props.activeMonth );
    var date = new Date( activeDate.year()
                       , activeDate.month()
                       , 1
                       );

    var result = [];

    for ( let i = 0; i < activeDate.daysInMonth(); i++ ) {
      result.push(
        <Day
          handleTaskAdd = { this.props.handleTaskAdd.bind( null, _.cloneDeep ( date ) ) }
          handleTaskRemove = { this.props.handleTaskRemove }
          chooseDay = { this.props.chooseDay }
          isToday = { today.isSame( date, "day" ) }
          isSelected = { i + 1 === this.props.selectedDay }
          dayOfMonth = { i + 1 }
          index = { i }
          tasks = { checkTaskDates( this.props.tasks, date )}/>
      );
      date.setDate( date.getDate() + 1 );
    }

    return result;
  }

  , render () {
    var activeMoment = moment().month( this.props.activeMonth );

    var start = activeMoment.startOf( "month" ).day();
    var end = ( 7 - ( ( start + activeMoment.daysInMonth() ) % 7 ) );

    return (
      <div className="month">
        <span className="day-label">Sunday</span>
        <span className="day-label">Monday</span>
        <span className="day-label">Tuesday</span>
        <span className="day-label">Wednesday</span>
        <span className="day-label">Thursday</span>
        <span className="day-label">Friday</span>
        <span className="day-label">Saturday</span>
        { this.createBlankDays( start ) }
        { this.createDays() }
        { end === 7 ? null : this.createBlankDays( end ) }
      </div>
    );
  }

});

export default Month;
