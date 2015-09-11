// Month
// =====
// A month for use in the Calendar view

"use strict";

import React from "react";

import moment from "moment";

import Day from "./Day";
import DropTarget from "../../components/DropTarget";

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
          handleTaskAdd = { this.handleTaskAdd }
          chooseDay = { this.props.chooseDay }
          isToday = { today.isSame( date, "day" ) }
          isSelected = { i + 1 === this.props.selectedDay }
          dayOfMonth = { i + 1 }
          index = { i }/>
      );
      date.setDate( date.getDate() + 1 );
    }

    return result;
  }

  , render () {
    var activeMoment = moment().month( this.props.activeMonth );

    var start = activeMoment.startOf( "month" ).day();
    var end = ( 7 - ( ( start + activeMoment.daysInMonth ) % 7 ) );

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
