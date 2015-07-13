// CALENDAR
// ========
// View containing information about all scheduled tasks, cronjobs, scrubs, etc

"use strict";

import React from "react";
import _ from "lodash";
import TWBS from "react-bootstrap";
import moment from "moment";

function createMonth ( time = moment() ) {
  let date = new Date( time.year(), time.month(), 1 );
  let result = [];

  while ( date.getMonth() === time.month() ) {
    result.push( null );
    date.setDate( date.getDate() + 1 );
  }

  return result;
}

const Calendar = React.createClass(
  { displayName: "Calendar"

  , componentDidMount: function () {
    window.MOMENT = moment();
  }

  , getInitialState: function () {
      let now = moment();

      return (
        { activeMonth  : now.month()
        , activeWeek   : now.day()
        , activeDay    : now.day()
        , monthContent : createMonth( now )
        , mode         : "month"
        }
      );
    }

  , createBlankDays: function ( number ) {
      let result = [];

      for ( let i = 0; i < number; i++ ) {
        result.push(
          <div
            key={ i }
            className="day"
          >
            <span className="day-content day-blank"></span>
          </div>
        );
      }

      return result;
    }

  , dayMonth: function ( contents, index ) {
      return (
        <div
          key={ index }
          className="day"
        >
          <span className="day-content">
            { index + 1 }
          </span>
        </div>
      );
    }

  , render: function () {
      let activeMoment = moment().month( this.state.activeMonth );
      let month = activeMoment.format( "MMMM" );
      let year  = activeMoment.format( "YYYY" );

      let start = activeMoment.startOf( "month" ).day();
      let end = ( 7 - ( ( start + this.state.monthContent.length ) % 7 ) );

      return (
        <main className="calendar">
          <h1><b>{ month }</b> { year }</h1>
          <div className="month">
            <span className="day-label">Sunday</span>
            <span className="day-label">Monday</span>
            <span className="day-label">Tuesday</span>
            <span className="day-label">Wednesday</span>
            <span className="day-label">Thursday</span>
            <span className="day-label">Friday</span>
            <span className="day-label">Saturday</span>
            { this.createBlankDays( start ) }
            { this.state.monthContent.map( this.dayMonth ) }
            { this.createBlankDays( end ) }
          </div>
        </main>
      );
    }

  }
);

export default Calendar;
