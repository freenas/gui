// CALENDAR
// ========
// View containing information about all scheduled tasks, cronjobs, scrubs, etc

"use strict";

import React from "react";
import _ from "lodash";
import { Button, ButtonGroup } from "react-bootstrap";
import moment from "moment";

import CM from "../../flux/middleware/CalendarMiddleware";
import CS from "../../flux/stores/CalendarStore";

import Day from "./Calendar/Day";

import EventBus from "../../utility/EventBus"
import Icon from "../components/Icon";

import CalendarTasksContext from "./Calendar/CalendarTasksContext";

function createMonth ( time = moment() ) {
  let today = moment();
  let date = new Date( time.year(), time.month(), 1 );
  let result = [];

  while ( date.getMonth() === time.month() ) {
    if ( today.isSame( date, "day" ) ) {
      result.push({ today: true });
    } else {
      result.push( null );
    }
    date.setDate( date.getDate() + 1 );
  }

  return result;
}

const Calendar = React.createClass(
  { displayName: "Calendar"

  , getInitialState: function () {
      let now = moment();

      return (
        { activeMonth  : now.month()
        , selectedDay  : now.date()
        , monthContent : createMonth( now )
        , mode         : "month"
        }
      );
    }

  , componentDidMount () {
    CS.addChangeListener( this.handleTaskUpdate );
    CM.subscribe( this.constructor.displayName );
    CM.requestCalendar();

    EventBus.emit( "showContextPanel", CalendarTasksContext );
  }

  , componentWillUnmount () {
    CS.removeChangeListener( this.handleTaskUpdate );
    CM.unsubscribe( this.constructor.displayName );

    EventBus.emit( "hideContextPanel", CalendarTasksContext );
  }

  // This will be more sophisticated when task updates emit events.
  , handleTaskUpdate () {
    this.setState( { tasks: CS.tasks } );
  }

  , handlePage: function ( direction ) {
      let now = moment().month( this.state.activeMonth );

      if ( direction === "prev" ) {
        now.subtract( 1, "months" );
      } else if ( direction === "next" ) {
        now.add( 1, "months" );
      }

      this.setState(
        { activeMonth  : now.month()
        , selectedDay  : now.startOf( "month" ).date()
        , monthContent : createMonth( now )
        }
      );
    }

  , handleToday: function ( direction ) {
      let now = moment();

      this.setState(
        { activeMonth  : now.month()
        , selectedDay  : now.date()
        , monthContent : createMonth( now )
        }
      );
    }

  , selectDay: function ( day ) {
      this.setState({ selectedDay: day });
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

  , handleTaskAdd () {
    console.log( "handleTaskAdd" );
  }

  , handleTaskRemove () {
    console.log( "handleTaskRemove" );
  }

  , dayMonth: function ( contents, index ) {
      let dayClass = [ "day" ];
      let today = false;
      let selected = false;

      if ( contents ) {
        if ( contents["today"] ) {
          today = true;
        }
      }
      if ( index + 1 === this.state.selectedDay ) {
        selected = true;
      }

      return <Day
               handleTaskAdd = { this.handleTaskAdd }
               selectDay = { this.selectDay.bind( this ) }
               isToday = { today }
               isSelected = { selected }
               dayOfMonth = { index + 1 }
               index = { index }/>;
    }

  , render: function () {
      let activeMoment = moment().month( this.state.activeMonth );
      let month = activeMoment.format( "MMMM" );
      let year  = activeMoment.format( "YYYY" );

      let start = activeMoment.startOf( "month" ).day();
      let end = ( 7 - ( ( start + this.state.monthContent.length ) % 7 ) );

      return (
        <main className="calendar">
          <div
            className = "clearfix"
            style     = {{ margin: "25px" }}
          >
            <h1
              className = "pull-left"
              style     = {{ margin: 0 }}
            ><b>{ month }</b> { year }</h1>

            <ButtonGroup
              className = "pull-right"
              style     = {{ margin: 0 }}
            >
              <Button
                onClick={ this.handlePage.bind( null, "prev" ) }
              ><Icon glyph="arrow-triangle-left" /></Button>
              <Button
                onClick={ this.handleToday }
              >Today</Button>
              <Button
                onClick={ this.handlePage.bind( null, "next" ) }
              ><Icon glyph="arrow-triangle-right" /></Button>

            </ButtonGroup>
          </div>

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
            { end === 7 ? null : this.createBlankDays( end ) }
          </div>
        </main>
      );
    }

  }
);

export default Calendar;
