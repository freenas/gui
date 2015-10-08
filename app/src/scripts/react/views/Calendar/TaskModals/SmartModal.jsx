// Scrub Task
// ==========
// Modal window to configure or edit a S.M.A.R.T. test task.

"use strict";

import React from "react";
import _ from "lodash";
import { Input } from "react-bootstrap";
import TaskSchedule from "../TaskSchedule";

import CM from "../../../../flux/middleware/CalendarMiddleware";
import CS from "../../../../flux/stores/CalendarStore";

const testTypes =
  [ "CONVEYANCE"
  , "LONG"
  , "OFFLINE"
  , "SHORT"
  ];

function createTestTypeOptions () {
  var testTypeOptions =
    testTypes.map( function makeTestTypeOption ( type ) {
                   return (
                     <option
                       value = { type }
                       key = { type }
                     >
                       { type }
                     </option>
                   );
                   }
                 );
  return testTypeOptions;
}

export default class SmartModal extends React.Component {
  constructor ( props ) {
    super( props );
    this.DisplayName = "SmartModal";

    this.state = {};
  }

  handleChange ( key, evt ) {
    switch ( key ) {
      case "taskID":
        this.setState( { taskID: evt.target.value } );
        break;
      case "disks":
        this.setState( { selectedDisks: this.refs.disks.getValue() } );
        break;
      case "testType":
        this.setState( { testType: evt.target.value } );
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

  createDiskOptions () {
    var options = [];

    options = _.map( this.props.disks
                   , function mapDiskOptions ( disk ) {
                     return (
                       <option
                         value = { disk.id }
                         key = { disk.id }
                       >
                         { disk.path }
                       </option>
                     );
                   }
                   );
    return options;
  }

  createTask () {
    var newTask = { schedule: {}
                  , name: "disks.parallel_test"
                  };

    if ( this.state.selectedDisks ) {
      newTask.args = [ this.state.selectedDisks ];
    }
    if ( this.state.testType ) {
      newTask.args = [ this.state.testType ];
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

    newTask.id = this.state.taskID;
    CM.createCalendarTask( newTask );
  }

  changeTask () {
    var newTask = { schedule: {}
                  , name: "disks.parallel_test"
                  };

    if ( this.state.selectedDisks  ) {
      newTask.args = [ this.state.selectedDisks ];
    } else if ( this.props.selectedDisks ) {
      newTask.args = [ this.props.selectedDisks ];
    }
    if ( this.state.testType ) {
      newTask.args.push( this.state.testType );
    } else if ( this.props.testType ) {
      newTask.args.push( this.props.testType );
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

  isTaskValid () {

    var taskIDToCheck = this.state.taskID || this.props.taskID;
    var validTaskID = taskIDToCheck !== ""
                   && _.find( CS.tasks
                            , { id: taskIDToCheck }
                            ) === undefined;


    var selectedDisks ;
    if ( !_.isEmpty( this.state.selectedDisks ) ) {
      selectedDisks = this.state.selectedDisks;
    } else {
      selectedDisks = this.props.selectedDisks;
    }
    // There must be a faster way to do this
    var validDisks = _.all( selectedDisks
                          , function checkDisk ( disk ) {
                              return _.find( this.props.disks
                                           , { id: disk }
                                           ) !== undefined;
                            }
                          , this
                          );

    return validTaskID && validDisks;
  }

  render () {
    var taskIDValue = this.state.taskID
                   || this.props.taskID;
    var selectedDisksValue = this.state.selectedDisks
                         || this.props.selectedDisks;
    var testTypeValue = this.state.testType
                     || this.props.testType;
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

    return (
      <div>
        <h4>S.M.A.R.T. Test</h4>
        { /* TODO: Add a warning when the task id is taken */ }
        <Input
          type = "text"
          onChange = { this.handleChange.bind( this, "taskID" ) }
          value = { taskIDValue }
          label = { "Task ID" }
        />
        <Input
          type = "select"
          multiple
          onChange = { this.handleChange.bind( this, "disks" ) }
          value = { selectedDisksValue }
          label = "Disks"
          ref = "disks"
        >
          { this.createDiskOptions() }
        </Input>
        <Input
          type = "select"
          onChange = { this.handleChange.bind( this, "testType" ) }
          value = { testTypeValue }
          label = "Test Type"
        >
          { createTestTypeOptions() }
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
          existsOnServer = { this.props.existsOnServer }
        />
      </div>
    );
  }
};

SmartModal.propTypes = { tasks: React.PropTypes.array
                       , disks: React.PropTypes.array
                       , testType: React.PropTypes.string
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
                       , existsOnServer: React.PropTypes.bool.isRequired
                       , handleTaskRemove: React.PropTypes.func.isRequired
                       };

SmartModal.defaultProps = { tasks: []
                          , disks: []
                          };
