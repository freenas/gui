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

// Be careful - in the actual scheduler the week starts with monday at index 0.
// https://apscheduler.readthedocs.org/en/latest/modules/triggers/cron.html#module-apscheduler.triggers.cron
const weekdays = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];

const Calendar = React.createClass(
  { displayName: "Calendar"

  , getInitialState () {
      let now = moment();

      return (
        { activeYear: now.year()
        , activeMonth: now.month()
        , selectedDate: now.date()
        , mode: "month"
        , tasks: []
        , activeTask: null
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
      let now = moment()
               .year( this.state.activeYear )
               .month( this.state.activeMonth );
      if ( direction === "prev" ) {
        now.subtract( 1, "months" );
      } else if ( direction === "next" ) {
        now.add( 1, "months" );
      }

      this.setState(
        { activeYear: now.year()
        , activeMonth: now.month()
        , selectedDate: now.startOf( "month" ).date()
        , tasks: CS.tasks
        }
      );
    }

  , handleToday ( ) {
      let now = moment();

      this.setState(
        { activeYear: now.year()
        , activeMonth: now.month()
        , selectedDate: now.date()
        , tasks: CS.tasks
        }
      );
    }

  , chooseDay ( day ) {
    var newState = { selectedDate: day
                   , tasks: CS.tasks
                   };

    if ( this.state.activeTask !== null ) {
      newState.activeTask = null;
    }
    this.setState( newState );
  }

  , handleTaskAdd ( targetDate, taskType ) {
    var newTask = {};

    // Create initial properties for each task type. For now, scrub and smart
    // tasks have basically identical defaults of the day of week targeted at
    // 2am, then every 35 days thereafter.
    switch ( taskType ) {
      case "scrub":
        newTask.name = "zfs.pool.scrub";
        newTask.schedule = { day_of_week: weekdays[ targetDate.getDay() ]
                           , day: "*"
                           , week: "*"
                           , month: "*"
                           , year: "*"
                           };
        newTask.coalesce = true;
        newTask.args = [ null ];
        break;

      case "smart":
        newTask.name = "disks.parallel_test";
        newTask.schedule = { day_of_week: weekdays[ targetDate.getDay() ]
                           , day: "*"
                           , week: "*"
                           , month: "*"
                           , year: "*"
                           };
        newTask.coalesce = true;
        newTask.args = [ null, "SHORT" ];
        break;
    }
    newTask.id = "";
    var newTasks = _.cloneDeep( this.state.tasks );
    newTasks.push( newTask );
    this.setState( { tasks: newTasks
                   , activeTask: ""
                   , selectedDate: targetDate.getDate()
                   }
                 );
  }

  , handleTaskRemove ( taskID ) {
    var newTasks = this.state.tasks;
    if ( _.any( CS.tasks
              , { id: taskID }
              ) ) {
      CM.deleteCalendarTask( taskID );
    }
    _.remove( this.state.tasks, { id: taskID } );
    this.setState( { tasks: newTasks } );
  }

  , chooseActiveTask ( taskID ) {
    this.setState( { activeTask: taskID } );
  }

  , render () {
      let activeMoment = moment()
                        .year( this.state.activeYear )
                        .month( this.state.activeMonth );

      let month = activeMoment.format( "MMMM" );
      let year = activeMoment.format( "YYYY" );

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
            activeYear = { this.state.activeYear }
            activeMonth = { this.state.activeMonth }
            selectedDate = { this.state.selectedDate }
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
