// Scrub Task
// ==========
// Modal window to configure or exit a ZFS scrub task.

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Popover } from "react-bootstrap";

import CM from "../../../../flux/middleware/CalendarMiddleware";
import CS from "../../../../flux/stores/CalendarStore";

import VS from "../../../../flux/stores/VolumeStore";
import ZM from "../../../../flux/middleware/ZfsMiddleware";

function generateDayOptions ( month, year ) {
  var dayOptions = [];

  dayOptions.push(
    <option
      key = { "*" }
      value = { "*" }>
      { null }
    </option>
  );

  for ( let i = 1; i < 29; i++ ) {
    dayOptions.push(
      <option
        key = { i.toString() }
        value = { i.toString() }>
        { i.toString() }
      </option>
    );
  }
  switch ( month ) {
    case "September":
    case "April":
    case "June":
    case "November":
    dayOptions.push( <option
                       key = { "29" }
                       value = { "29" }>
                       { "29" }
                     </option>
                   , <option
                       key = { "30" }
                       value = { "30" }>
                       { "30" }
                     </option>
                   );
    break;
    case "January":
    case "March":
    case "May":
    case "July":
    case "August":
    case "October":
    case "December":
    dayOptions.push( <option
                       key = { "29" }
                       value = { "29" }>
                       { "29" }
                     </option>
                   , <option
                       key = { "30" }
                       value = { "30" }>
                       { "30" }
                     </option>
                   , <option
                       key = { "31" }
                       value = { "31" }>
                       { "31" }
                     </option>
                   );
    break;

    case "February":
    if ( year % 4 === 0 ) {
      dayOptions.push( <option
                         key = { "29" }
                         value = { "29" }>
                         { "29" }
                       </option>
                     );
    }
    break;
  }
  return dayOptions;
}

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
    console.log( newTask );
    CM.createCalendarTask( newTask );
  }

  , changeTask () {

  }

  , render () {
    return (
      <div>
        <h4>ZFS Scrub</h4>
        { /* TODO: Add a warning when the task id is taken */ }
        <Input
          type = "text"
          onChange = { this.handleChange.bind( null, "taskID" ) }
          value = { this.state.taskID }
          label = { "Task ID" } />
        <Input
          type = "select"
          onChange = { this.handleChange.bind( null, "selectedVolume" ) }
          value = { this.state.selectedVolume }
          label = "Volume">
          { this.createVolumeOptions() }
        </Input>
        <Input
          type = "select"
          onChange = { this.handleChange.bind( null, "day_of_week" ) }
          value = { this.state.day_of_week }
          label = "Weekday">
          <option
            value = { "*" }
            key = { "*" }>
            { null }
          </option>
          <option
            value = { "0" }
            key = { "Sunday" }>
            { "Sunday" }
          </option>
          <option
            value = { "1" }
            key = { "Monday" }>
            { "Monday" }
          </option>
          <option
            value = { "2" }
            key = { "Tuesday" }>
            { "Tuesday" }
          </option>
          <option
            value = { "3" }
            key = { "Wednesday" }>
            { "Wednesday" }
          </option>
          <option
            value = { "4" }
            key = { "Thursday" }>
            { "Thursday" }
          </option>
          <option
            value = { "5" }
            key = { "Friday" }>
            { "Friday" }
          </option>
          <option
            value = { "6" }
            key = { "Saturday" }>
            { "Saturday" }
          </option>
        </Input>
        <Input
          type = "select"
          onChange = { this.handleChange.bind( null, "day" ) }
          value = { this.state.day }
          label = "Day">
          { generateDayOptions( this.state.month, this.state.year ) }
        </Input>
        <Input
          type = "select"
          onChange = { this.handleChange.bind( null, "month" ) }
          value = { this.state.month }
          label = "Month">
          <option
            value = { "*" }
            key = { "*" }>
            { null }
          </option>
          <option
            value = { "0" }
            key = { "January" }>
            { "January" }
          </option>
          <option
            value = { "1" }
            key = { "February" }>
            { "February" }
          </option>
          <option
            value = { "2" }
            key = { "March" }>
            { "March" }
          </option>
          <option
            value = { "3" }
            key = { "April" }>
            { "April" }
          </option>
          <option
            value = { "4" }
            key = { "May" }>
            { "May" }
          </option>
          <option
            value = { "5" }
            key = { "June" }>
            { "June" }
          </option>
          <option
            value = { "6" }
            key = { "July" }>
            { "July" }
          </option>
          <option
            value = { "7" }
            key = { "August" }>
            { "August" }
          </option>
          <option
            value = { "8" }
            key = { "September" }>
            { "September" }
          </option>
          <option
            value = { "9" }
            key = { "October" }>
            { "October" }
          </option>
          <option
            value = { "10" }
            key = { "November" }>
            { "November" }
          </option>
          <option
            value = { "11" }
            key = { "December" }>
            { "December" }
          </option>
        </Input>
        <Input
          type = "select"
          onChange = { this.handleChange.bind( null, "year" ) }
          value = { this.state.year }
          label = "Year">
          <option
            value = { "*" }
            key = { "*" }>
            { null }
          </option>
          <option
            value = { "2015" }
            key = { "2015" }>
            { "2015" }
          </option>
          <option
            value = { "2016" }
            key = { "2016" }>
            { "2016" }
          </option>
          <option
            value = { "2017" }
            key = { "2017" }>
            { "2017" }
          </option>
          <option
            value = { "2018" }
            key = { "2018" }>
            { "2018" }
          </option>
          <option
            value = { "2019" }
            key = { "2019" }>
            { "2019" }
          </option>
          <option
            value = { "2020" }
            key = { "2020" }>
            { "2020" }
          </option>
          <option
            value = { "2021" }
            key = { "2021" }>
            { "2021" }
          </option>
          <option
            value = { "2022" }
            key = { "2022" }>
            { "2022" }
          </option>
          <option
            value = { "2023" }
            key = { "2023" }>
            { "2023" }
          </option>
          <option
            value = { "2024" }
            key = { "2024" }>
            { "2024" }
          </option>
          <option
            value = { "2025" }
            key = { "2025" }>
            { "2025" }
          </option>
          <option
            value = { "2026" }
            key = { "2026" }>
            { "2026" }
          </option>
          <option
            value = { "2027" }
            key = { "2027" }>
            { "2027" }
          </option>
          <option
            value = { "2028" }
            key = { "2028" }>
            { "2028" }
          </option>
          <option
            value = { "2029" }
            key = { "2029" }>
            { "2029" }
          </option>
          <option
            value = { "2030" }
            key = { "2030" }>
            { "2030" }
          </option>
          <option
            value = { "2031" }
            key = { "2031" }>
            { "2031" }
          </option>
          <option
            value = { "2032" }
            key = { "2032" }>
            { "2032" }
          </option>
          <option
            value = { "2033" }
            key = { "2033" }>
            { "2033" }
          </option>
          <option
            value = { "2034" }
            key = { "2034" }>
            { "2034" }
          </option>
          <option
            value = { "2035" }
            key = { "2035" }>
            { "2035" }
          </option>
          <option
            value = { "2036" }
            key = { "2036" }>
            { "2036" }
          </option>
          <option
            value = { "2037" }
            key = { "2037" }>
            { "2037" }
          </option>
          <option
            value = { "2038" }
            key = { "2038" }>
            { "2038" }
          </option>
        </Input>
      </div>
    );
  }
});

export default ScrubModal;
