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

import Month from "./Calendar/Month";

import EventBus from "../../utility/EventBus"
import Icon from "../components/Icon";

import CalendarTasksContext from "./Calendar/CalendarTasksContext";

const Calendar = React.createClass(
  { displayName: "Calendar"

  , getInitialState () {
      let now = moment();

      return (
        { activeMonth  : now.month()
        , selectedDay  : now.date()
        , mode         : "month"
        , tasks        : []
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

  , handlePage ( direction ) {
      let now = moment().month( this.state.activeMonth );

      if ( direction === "prev" ) {
        now.subtract( 1, "months" );
      } else if ( direction === "next" ) {
        now.add( 1, "months" );
      }

      this.setState(
        { activeMonth: now.month()
        , selectedDay: now.startOf( "month" ).date()
        }
      );
    }

  , handleToday ( ) {
      let now = moment();

      this.setState(
        { activeMonth: now.month()
        , selectedDay: now.date()
        }
      );
    }

  , chooseDay ( day ) {
      this.setState( { selectedDay: day } );
    }

  , handleTaskAdd ( targetDate, taskType ) {
    var newTask = {};

    // Create initial properties for each task type. For now, scrub and smart
    // tasks have basically identical defaults of the day of week targeted at
    // 2am, then every 35 days thereafter.
    switch ( taskType ) {
      case "scrub":
        newTask.name = "zfs.pool.scrub";
        newTask.schedule = { day_of_week: targetDate.getDay().toString()
                           , day: "*"
                           , week: "*"
                           , month: "*"
                           , year: "*"
                           };
        newTask.coalesce = true;
        newTask.args = [ null ];
        break;

      case "smart":
        newTask.name = "disks.test";
        newTask.schedule = { day_of_week: targetDate.getDay().toString()
                           , day: "*"
                           , week: "*"
                           , month: "*"
                           , year: "*"
                           };
        newTask.coalesce = true;
        newTask.args = [ null, "SHORT" ];
        break;
    }
    newTask.id = "task" + this.state.tasks.length;
    var newTasks = _.cloneDeep( this.state.tasks );
    newTasks.push( newTask );
    this.setState( { tasks: newTasks } );
  }

  , handleTaskRemove () {
    console.log( "handleTaskRemove" );
  }

  , chooseActiveTask ( taskID ) {
    this.setState( { activeTask: taskID } );
  }

  , render () {
      let activeMoment = moment().month( this.state.activeMonth );
      let month = activeMoment.format( "MMMM" );
      let year  = activeMoment.format( "YYYY" );

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

          <Month
            tasks = { this.state.tasks }
            activeMonth = { this.state.activeMonth }
            selectedDay = { this.state.selectedDay }
            chooseDay = { this.chooseDay }
            handleTaskRemove = { this.handleTaskRemove }
            handleTaskAdd = { this.handleTaskAdd }
            chooseActiveTask = { this.chooseActiveTask }
            activeTask = { this.state.activeTask }/>
        </main>
      );
    }
  }
);

export default Calendar;
