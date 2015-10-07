// Month
// =====
// A month for use in the Calendar view

"use strict";

import React from "react";
import _ from "lodash";

import moment from "moment";

import Day from "./Day";
import DropTarget from "../../components/DropTarget";

const weekdays = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];

// Primitive and messy
function checkTaskDates ( tasks, date ) {
  var matchingTasks = [];
  _.forEach( tasks
           , function checkScheduleMatch ( task ) {

             var matchDay;
             if ( task.schedule.day === "*" ) {
               matchDay = true;
             } else if ( _.has( task.schedule, "day" ) ) {
               matchDay = task.schedule.day === date.getDate().toString()
                        ? true
                        : false;
             }

             var matchWeekday;
             if ( task.schedule.day_of_week === "*" ) {
               matchWeekday = true;
             } else if ( _.has( task.schedule, "day_of_week" ) ) {
               matchWeekday = task.schedule.day_of_week === weekdays[ date.getDay() ]
                            ? true
                            : false;
             }

             var matchWeek;
             if ( task.schedule.week === "*" ) {
               matchWeek = true;
             } else if ( _.has( task.schedule, "day_of_week" ) ) {
               matchWeek = task.schedule.week === moment(date).week().toString()
                         ? true
                         : false;
             }

             var matchMonth;
             if ( task.schedule.month === "*" ) {
               matchMonth = true;
             } else if ( _.has( task.schedule, "month" ) ) {
               matchMonth = task.schedule.month === date.getMonth().toString()
                          ? true
                          : false;
             }

             var matchYear;
             if ( task.schedule.year === "*" ) {
               matchYear = true;
             } else if ( _.has( task.schedule, "year" ) ) {
               matchYear = task.schedule.year === date.getYear().toString()
                         ? true
                         : false;
             }

             if ( matchDay
               && matchWeekday
               && matchWeek
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
           , selectedDate: moment().date()
           , activeTask: ""
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
    const activeDate = moment()
                      .year( this.props.activeYear )
                      .month( this.props.activeMonth );
    var date = new Date( activeDate.year()
                       , activeDate.month()
                       , 1
                       );

    var result = [];

    for ( let i = 1; i < activeDate.daysInMonth(); i++ ) {
      result.push(
        <Day
          key = { i }
          handleTaskAdd = { this.props.handleTaskAdd.bind( null, _.cloneDeep ( date ) ) }
          handleTaskRemove = { this.props.handleTaskRemove }
          chooseDate = { this.props.chooseDate.bind( null, i ) }
          isToday = { today.isSame( date, "day" ) }
          isSelected = { i === this.props.selectedDate }
          dayOfMonth = { i }
          index = { i }
          tasks = { checkTaskDates( this.props.tasks, date ) }
          disks = { this.props.disks }
          volumes = { this.props.volumes }
          chooseActiveTask = { this.props.chooseActiveTask }
          activeTask = { this.props.activeTask }
        />
      );
      date.setDate( date.getDate() + 1 );
    }

    return result;
  }

  , render () {
    var activeMoment = moment()
                      .year( this.props.activeYear )
                      .month( this.props.activeMonth );

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
