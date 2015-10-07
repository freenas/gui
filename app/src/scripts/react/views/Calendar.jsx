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

import DS from "../../flux/stores/DisksStore";
import DM from "../../flux/middleware/DisksMiddleware";

import VS from "../../flux/stores/VolumeStore";
import VM from "../../flux/middleware/VolumeMiddleware";

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
        , disks: []
        , volumes: []
        }
      );
    }

  , componentDidMount () {
    CS.addChangeListener( this.handleTaskUpdate );
    CM.subscribe( this.constructor.displayName );
    CM.requestCalendar();

    DS.addChangeListener( this.handleDisks );
    DM.subscribe( this.constructor.displayName );
    DM.requestDisksOverview();

    VS.addChangeListener( this.handleVolumes );
    VM.subscribe( this.constructor.displayName );
    VM.requestVolumes();

    EventBus.emit( "showContextPanel", CalendarTasksContext );
  }

  , componentWillUnmount () {
    CS.removeChangeListener( this.handleTaskUpdate );
    CM.unsubscribe( this.constructor.displayName );

    DS.removeChangeListener( this.handleDisks );
    DM.unsubscribe( this.constructor.displayName );

    VS.removeChangeListener( this.handleVolumes );
    VM.unsubscribe( this.constructor.displayName );

    EventBus.emit( "hideContextPanel", CalendarTasksContext );
  }

  // This will be more sophisticated when task updates emit events.
  , handleTaskUpdate () {
    this.setState( { tasks: CS.tasks } );
  }

  // TODO: Check somewhere whether the disks are capable of running SMART tests
  , handleDisks () {
    this.setState( { disks: DS.onlineDisks } );
  }

  , handleVolumes () {
    this.setState( { volumes: VS.listVolumes( "name" ) } );
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
        , activeTask: null
        }
      );
    }

  , chooseDate ( date ) {
    this.setState( { selectedDate: date } );
  }

  , handleTaskAdd ( targetDate, taskType ) {
    var newTask = {};

    // Create initial properties for each task type. For now, all tasks start
    // repeating weekly in the weekday they were dropped into.
    switch ( taskType ) {
      case "scrub":
        newTask.name = "zfs.pool.scrub";
        newTask.id = "new_scrub"
        newTask.schedule = { day_of_week: weekdays[ targetDate.getDay() ]
                           , day: "*"
                           , week: "*"
                           , month: "*"
                           , year: "*"
                           , coalesce: true
                           };
        newTask.args = [ this.state.volumes[0]
                       ? this.state.volumes[0].name
                       : ""
                       ];
        break;

      case "smart":
        newTask.name = "disks.parallel_test";
        newTask.id = "new_SMART_test"
        newTask.schedule = { day_of_week: weekdays[ targetDate.getDay() ]
                           , day: "*"
                           , week: "*"
                           , month: "*"
                           , year: "*"
                           , coalesce: true
                           };
        newTask.args = [ null, "SHORT" ];
        break;
    }

    // Check if the default task id is taken and replace it if necessary
    // TODO: This is probably not very performant.
    var taskIDAttempt = 1;
    var newTaskID = newTask.id;
    while ( _.contains( newTasks
                      , { id: newTaskID }
                      ) ) {
      newTaskID = newTask.id + taskIDAttempt;
      taskIDAttempt++;
    }

    newTask.id = newTaskID;
    var newTasks = _.cloneDeep( this.state.tasks );
    newTasks.push( newTask );

    this.setState( { tasks: newTasks
                   , activeTask: newTask.id
                   , selectedDate: targetDate.getDate()
                   }
                 );
  }

  , handleTaskRemove ( taskID ) {
    console.log( newTasks );
    var newTasks = _.cloneDeep( this.state.tasks );
    if ( _.any( CS.tasks
              , { id: taskID }
              ) ) {
      CM.deleteCalendarTask( taskID );
    } else {
      _.remove( newTasks, { id: taskID } );
      this.setState( { tasks: newTasks
                     , activeTask: null
                     } );
    }
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
            chooseDate = { this.chooseDate }
            handleTaskRemove = { this.handleTaskRemove }
            handleTaskAdd = { this.handleTaskAdd }
            chooseActiveTask = { this.chooseActiveTask }
            { ...this.state }
          />
        </main>
      );
    }
  }
);

export default Calendar;
