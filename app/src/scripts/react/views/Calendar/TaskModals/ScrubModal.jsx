// Scrub Task
// ==========
// Modal window to configure or edit a ZFS scrub task.

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";
import TaskSchedule from "../TaskSchedule";

import CM from "../../../../flux/middleware/CalendarMiddleware";
import CS from "../../../../flux/stores/CalendarStore";

import VS from "../../../../flux/stores/VolumeStore";
import ZM from "../../../../flux/middleware/ZfsMiddleware";

const ScrubModal = React.createClass(
  { propTypes: { tasks: React.PropTypes.array
               , selectedVolume: React.PropTypes.string
               , taskID: React.PropTypes.string
               , day_of_week: React.PropTypes.string
               , week: React.PropTypes.string
               , day: React.PropTypes.string
               , month: React.PropTypes.string
               , year: React.PropTypes.string
               // , second: React.PropTypes.string
               // , minute: React.PropTypes.string
               // , hour: React.PropTypes.string
               , coalesce: React.PropTypes.bool
               , handleTaskRemove: React.PropTypes.func
               }

  , getDefaultProps () {
    return { tasks: [] };
  }

  , getInitialState () {
    return { volumes: [] }
  }

  , componentDidMount () {
    VS.addChangeListener( this.handleVolumes );

    ZM.subscribe( this.constructor.displayName );
    ZM.requestVolumes();
  }

  , componentWillUnmount () {
    VS.removeChangeListener( this.handleVolumes );

    ZM.unsubscribe( this.constructor.displayName );
  }

  , handleChange ( key, evt ) {
    switch ( key ) {
      case "taskID":
        this.setState( { taskID: evt.target.value } );
        break;
      case "selectedVolume":
        this.setState( { selectedVolume: evt.target.value } );
        break;
      case "day_of_week":
        this.setState( { day_of_week: evt.target.value } );
        break;
      case "day":
        this.setState( { day: evt.target.value } );
        break;
      case "month":
        this.setState( { month: evt.target.value } );
        break;
      case "year":
        this.setState( { year: evt.target.value } );
        break;
      case "coalesce":
        this.setState( { coalesce: evt.target.checked } );
        break;
    }
  }

  , handleVolumes () {
    this.setState( { volumes: VS.listVolumes( "name" ) } );
  }

  , createVolumeOptions () {
    var options = [];

    if ( _.has( this, [ "state", "volumes" ] ) ) {
      options = _.map( this.state.volumes
                     , function mapVolumeNameOptions ( volume ) {
                       return (
                         <option
                           value = { volume.name }
                           key = { volume.name }>
                           { volume.name }
                         </option>
                       );
                     }
                     );
    }

    options.unshift(
      <option
        value = { null }
        key = { 0 }>
        { null }
      </option>
    );
    return options;
  }

  , createTask () {
    var newTask = { schedule: {}
                  , name: "zfs.pool.scrub"
                  };

    if ( _.has( this.state, "selectedVolume" ) ) {
      newTask.args = [ this.state.selectedVolume ];
    }
    if ( _.has( this.state, "day_of_week" )
      && this.state.day_of_week ) {
      newTask.schedule.day_of_week = this.state.day_of_week;
    } else if ( _.has( this.props, "day_of_week" )
      && this.props.day_of_week ) {
      // day_of_week is different because it can be present without any other
      // settings made
      newTask.schedule.day_of_week = this.props.day_of_week;
    }
    if ( _.has( this.state, "day" )
      && this.state.day ) {
      newTask.schedule.day = this.state.day;
    }
    if ( _.has( this.state, "week" )
      && this.state.week ) {
      newTask.schedule.week = this.state.week;
    }
    if ( _.has( this.state, "month" )
      && this.state.month ) {
      newTask.schedule.month = this.state.month;
    }
    if ( _.has( this.state, "year" )
      && this.state.year ) {
      newTask.schedule.year = this.state.year;
    }
    if ( _.has( this.state, "coalesce" )
      && this.state.coalesce ) {
      newTask.schedule.coalesce = this.state.coalesce;
    }

    newTask.id = this.state.taskID;
    CM.createCalendarTask( newTask );
  }

  , changeTask () {
    var newTask = { schedule: {}
                  , name: "zfs.pool.scrub"
                  };

    if ( _.has( this.state, "selectedVolume" ) ) {
      newTask.args = [ this.state.selectedVolume ];
    } else if ( _.has( this.props, "selectedVolume" ) ) {
      newTask.args = [ this.props.selectedVolume ];
    }
    if ( _.has( this.state, "day_of_week" )
      && this.state.day_of_week ) {
      newTask.schedule.day_of_week = this.state.day_of_week;
    } else if ( _.has( this.props, "day_of_week" )
      && this.props.day_of_week ) {
      newTask.schedule.day_of_week = this.props.day_of_week;
    }
    if ( _.has( this.state, "day" )
      && this.state.day ) {
      newTask.schedule.day = this.state.day;
    } else if ( _.has( this.props, "day" )
      && this.state.day ) {
      newTask.schedule.day = this.state.day;
    }
    if ( _.has( this.state, "week" )
      && this.state.week ) {
      newTask.schedule.week = this.state.week;
    } else if ( _.has( this.props, "week" )
      && this.state.week ) {
      newTask.schedule.week = this.state.week;
    }
    if ( _.has( this.state, "month" )
      && this.state.month ) {
      newTask.schedule.month = this.state.month;
    } else if ( _.has( this.props, "month" )
      && this.state.month ) {
      newTask.schedule.month = this.state.month;
    }
    if ( _.has( this.state, "year" )
      && this.state.year ) {
      newTask.schedule.year = this.state.year;
    } else if ( _.has( this.props, "year" )
      && this.state.year ) {
      newTask.schedule.year = this.state.year;
    }
    if ( _.has( this.state, "coalesce" )
      && this.state.coalesce ) {
      newTask.schedule.coalesce = this.state.coalesce;
    } else if ( _.has( this.props, "coalesce" )
      && this.props.coalesce ) {
      newTask.schedule.coalesce = this.props.coalesce;
    }
    newTask.id = this.state.taskID || this.props.taskID;

    CM.updateCalendarTask( this.props.taskID, newTask );
  }

  , isTaskValid () {
    var taskIsValid;
    var idValid;
    if ( this.state.taskID ) {
      if ( this.props.taskID === this.state.taskID ) {
      // If you happen to have returned the task ID to its original state,
      // it's valid, but the task may not be
      idValid = true;
      } else {
        // otherwise check that it's not already taken. Changing the task name
        // means the task is valid.
        taskIsValid = ( _.find( CS.tasks
                              , function checkTaskIdUnique ( task ) {
                                return _.has( task, { id: this.state.taskID } );
                              }
                              , this
                              )
                    === undefined
                      );
      }
    } else if ( this.props.taskID !== "" ) {
      // It doesn't matter if there isn't an id in state if the task exists on
      // the server already.
      idValid = true;
    } else {
      // No new id and no prexisting id means the id is not valid. This fails
      // the check overall.
      idValid = false;
      taskIsValid =  false;
    }

    // Only keep checking if task validity has not been determined.
    if ( taskIsValid !== undefined ) {

      var volumeToCheck = this.state.selectedVolume || this.props.selectedVolume;
      var volumeValid = _.any( this.state.volumes
                             , function checkVolumeExists ( volume ) {
                               return volume.name === volumeToCheck;
                             }
                             , this
                             );

      // FIXME: There should be invalid cases where some of these are true, such
      // as days that don't exist (monday in the first week of a year that has
      // no monday in the first week, for example).
      // FIXME: it is probably possible to pass this check unintentionally by
      // selecting the  wildcard option, putting that value in state. This will
      // result in a task that runs every day. On the other hand, it is also
      // possible to WANT a task to run every day.
      var scheduleValid;
      if ( this.props.taskID ) {
          scheduleValid = this.state.day_of_week
                       || this.state.day
                       || this.state.week
                       || this.state.month
                       || this.state.year;
          taskIsValid = scheduleValid || volumeValid;
        } else {
          scheduleValid = ( this.state.day_of_week || this.props.day_of_week)
                       || ( this.state.day || this.props.day)
                       || ( this.state.week || this.props.week)
                       || ( this.state.month || this.props.month)
                       || ( this.state.year || this.props.year);
          taskIsValid = scheduleValid && volumeValid;
        }
    }

    return taskIsValid;
  }

  , render () {
  var taskIDValue = this.state.taskID
                 || this.props.taskID;
  var selectedVolumeValue = this.state.selectedVolume
                         || this.props.selectedVolume;
  var day_of_weekValue = this.state.day_of_week
                      || this.props.day_of_week
                      || "*";
  var dayValue = this.state.day
              || this.props.day
              || "*";
  var weekValue = this.state.week
               || this.props.week
               || "*";
  var monthValue = this.state.month
                || this.props.month
                || "*";
  var yearValue = this.state.year
               || this.props.year
               || "*";

    // Used to create new tasks
    const submitButton =
      <Button
        onClick = { this.createTask }
        bsStyle = "primary"
        disabled = { !this.isTaskValid() }>
        { "Submit" }
      </Button>;

    // Used to update existing tasks
    const changeButton =
      <Button
        onClick = { this.changeTask }
        bsStyle = "primary"
        disabled = { !this.isTaskValid() }>
        { "Submit" }
      </Button>;

    // Used to discard new tasks
    const cancelButton =
      <Button
        onClick = { this.props.handleTaskRemove }
        bsStyle = "default">
        { "Cancel" }
      </Button>;

    // Used to unselect existing tasks
    const resetButton =
      <Button
        onClick = { this.props.chooseActiveTask.bind( null, null ) }
        bsStyle = "default">
        { "Cancel" }
      </Button>;

    return (
      <div>
        <h4>ZFS Scrub</h4>
        { /* TODO: Add a warning when the task id is taken */ }
        <Input
          type = "text"
          onChange = { this.handleChange.bind( null, "taskID" ) }
          value = { taskIDValue }
          label = { "Name" } />
        <Input
          type = "select"
          onChange = { this.handleChange.bind( null, "selectedVolume" ) }
          value = { selectedVolumeValue }
          label = "Volume">
          { this.createVolumeOptions() }
        </Input>
        <TaskSchedule
          day_of_week = { day_of_weekValue }
          week = { weekValue }
          day = { dayValue }
          month = { monthValue }
          year = { yearValue }
          // second = { secondValue }
          // minute = { minuteValue }
          // hour = { hourValue }
          // coalesce = { coalesceValue }
          handleChange = { this.handleChange }/>
        <ButtonToolbar>
          { this.props.taskID
          ? changeButton
          : submitButton
          }
          { this.props.taskID
          ? resetButton
          : cancelButton }
        </ButtonToolbar>
      </div>
    );
  }
});

export default ScrubModal;
