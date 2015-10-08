// Scrub Task
// ==========
// Modal window to configure or edit a ZFS scrub task.

"use strict";

import React from "react";
import _ from "lodash";
import { Input } from "react-bootstrap";
import TaskSchedule from "../TaskSchedule";

import CM from "../../../../flux/middleware/CalendarMiddleware";
import CS from "../../../../flux/stores/CalendarStore";

export default class ScrubModal extends React.Component {
  constructor ( props ) {
    super( props );
    this.DisplayName = "ScrubModal";

    this.state = {};
  }

  handleChange ( key, evt ) {
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

  createVolumeOptions () {
    var options = [];

    options = _.map( this.props.volumes
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

    return options;
  }

  createTask () {
    var newTask = { schedule: {}
                  , name: "zfs.pool.scrub"
                  };

    if ( this.state.selectedVolume  ) {
      newTask.args = [ this.state.selectedVolume ];
    } else if ( this.props.selectedVolume ) {
      newTask.args = [ this.props.selectedVolume ];
    }
    newTask.schedule.day_of_week = this.state.day_of_week
                                || this.props.day_of_week;
    newTask.schedule.day = this.state.day || this.props.day;
    newTask.schedule.week = this.state.week || this.props.week;
    newTask.schedule.month = this.state.month || this.props.month;
    newTask.schedule.year = this.state.year || this.props.year;
    if ( this.state.coalesce !== undefined ) {
      newTask.schedule.coalesce = this.state.coalesce;
    } else {
      newTask.schedule.coalesce = this.props.coalesce;
    }

    newTask.id = this.state.taskID || this.props.taskID ;

    CM.createCalendarTask( newTask );
  }

  changeTask () {
    var newTask = { schedule: {}
                  , name: "zfs.pool.scrub"
                  };

    if ( this.state.selectedVolume ) {
      newTask.args = [ this.state.selectedVolume ];
    } else if ( this.props.selectedVolume ) {
      newTask.args = [ this.props.selectedVolume ];
    }
    newTask.schedule.day_of_week = this.state.day_of_week
                                || this.props.day_of_week;
    newTask.schedule.day = this.state.day || this.props.day;
    newTask.schedule.week = this.state.week || this.props.week;
    newTask.schedule.month = this.state.month || this.props.month;
    newTask.schedule.year = this.state.year || this.props.year;
    if ( this.state.coalesce !== undefined ) {
      newTask.schedule.coalesce = this.state.coalesce;
    } else {
      newTask.schedule.coalesce = this.props.coalesce;
    }

    newTask.id = this.state.taskID || this.props.taskID;

    CM.updateCalendarTask( this.props.taskID, newTask );
  }

  resetTask () {
    var newState = { selectedVolume: null
                   , taskID: null
                   , day_of_week: null
                   , week: null
                   , day: null
                   , month: null
                   , year: null
                   // , second: null
                   // , minute: null
                   // , hour: null
                   , coalesce: null
                   };
    this.setState( newState );
  }

  isTaskValid () {

    var taskIDToCheck = this.state.taskID || this.props.taskID;
    var validTaskID = taskIDToCheck !== ""
                   && _.find( this.props.tasks
                            , { id: taskIDToCheck }
                            ) !== undefined;

    var volumeToCheck = this.state.selectedVolume || this.props.selectedVolume;
    var validVolume = _.find( this.props.volumes
                            , { name: volumeToCheck }
                            ) !== undefined;

    return validTaskID && validVolume;
  }

  render () {
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
    var coalesceValue = this.state.coalesce
                     || this.props.coalesce
                     || false;

    // Is it okay to use CS.tasks this way, since this will only render in the
    // context of calendar, which already handles data for that?
    var existsOnServer = _.find( CS.tasks
                               , { id: this.props.taskID }
                               ) !== undefined;

    return (
      <div>
        <h4>ZFS Scrub</h4>
        { /* TODO: Add a warning when the task id is taken */ }
        <Input
          type = "text"
          onChange = { this.handleChange.bind( this, "taskID" ) }
          value = { taskIDValue }
          label = { "Name" }
        />
        <Input
          type = "select"
          onChange = { this.handleChange.bind( this, "selectedVolume" ) }
          value = { selectedVolumeValue }
          label = "Volume"
        >
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
          coalesce = { coalesceValue }
          handleChange = { this.handleChange.bind( this ) }
          isTaskValid = { this.isTaskValid.bind( this ) }
          createTask = { this.createTask.bind( this ) }
          changeTask = { this.changeTask.bind( this ) }
          handleTaskRemove = { this.props.handleTaskRemove }
          existsOnServer = { existsOnServer }
        />
      </div>
    );
  }
};

ScrubModal.propTypes = { tasks: React.PropTypes.array
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
                       , volumes: React.PropTypes.array
                       };

ScrubModal.defaultProps = { tasks: []
                          , volumes: []
                          };
