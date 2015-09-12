// Scrub Task
// ==========
// Modal window to configure or exit a ZFS scrub task.

"use strict";

import React from "react";
import { Input, Popover } from "react-bootstrap";

// import TM from "../../../../flux/middleware/TaskMiddleware";
// import TS from "../../../../flux/stores/TaskStore";

import VS from "../../../../flux/stores/VolumeStore";
import ZM from "../../../../flux/middleware/ZfsMiddleware";

function generateDayOptions ( month, year ) {
  var dayOptions = [];

  for ( i = 1; i < 29; i++ ) {
    dayOptions.push(
      <option
        key = { i }
        value = { i }>
        { i }
      </option>
    );
  }
  switch ( month ) {
    case "September":
    case "April":
    case "June":
    case "November":
    dayOptions.push( <option
                       key = { 29 }
                       value = { 29 }>
                       { 29 }
                     </option>
                   , <option
                       key = { 30 }
                       value = { 30 }>
                       { 30 }
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
                       key = { 29 }
                       value = { 29 }>
                       { 29 }
                     </option>
                   , <option
                       key = { 30 }
                       value = { 30 }>
                       { 30 }
                     </option>
                   , <option
                       key = { 31 }
                       value = { 31 }>
                       { 31 }
                     </option>
                   );
    break;

    case "February":
    if ( year % 4 === 0 ) {
      dayOptions.push( <option
                         key = { 29 }
                         value = { 29 }>
                         { 29 }
                       </option>
                     );
    }

    break;
  }


  return dayOptions;
}

const ScrubModal = React.createClass(
  { getDefaultProps () {
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
    return options;
  }

  , render () {
    return (
      <div>
        <h4>ZFS Scrub</h4>
        <Input type = "select">
          { this.createVolumeOptions() }
        </Input>
        <Input type = "select">
          <option
            value = { null }
            key = { "none" }>
            { "" }
          </option>
          <option
            value = { "Sunday" }
            key = { "Sunday" }>
            { "Sunday" }
          </option>
          <option
            value = { "Monday" }
            key = { "Monday" }>
            { "Monday" }
          </option>
          <option
            value = { "Tuesday" }
            key = { "Tuesday" }>
            { "Tuesday" }
          </option>
          <option
            value = { "Wednesday" }
            key = { "Wednesday" }>
            { "Wednesday" }
          </option>
          <option
            value = { "Thursday" }
            key = { "Thursday" }>
            { "Thursday" }
          </option>
          <option
            value = { "Friday" }
            key = { "Friday" }>
            { "Friday" }
          </option>
          <option
            value = { "Saturday" }
            key = { "Saturday" }>
            { "Saturday" }
          </option>
        </Input>
        <Input type = "select">
          <option
            value = { null }
            key = { "none" }>
            { "" }
          </option>
          <option
            value = { "January" }
            key = { "January" }>
            { "January" }
          </option>
          <option
            value = { "February" }
            key = { "February" }>
            { "February" }
          </option>
          <option
            value = { "March" }
            key = { "March" }>
            { "March" }
          </option>
          <option
            value = { "April" }
            key = { "April" }>
            { "April" }
          </option>
          <option
            value = { "May" }
            key = { "May" }>
            { "May" }
          </option>
          <option
            value = { "June" }
            key = { "June" }>
            { "June" }
          </option>
          <option
            value = { "July" }
            key = { "July" }>
            { "July" }
          </option>
          <option
            value = { "August" }
            key = { "August" }>
            { "August" }
          </option>
          <option
            value = { "September" }
            key = { "September" }>
            { "September" }
          </option>
          <option
            value = { "October" }
            key = { "October" }>
            { "October" }
          </option>
          <option
            value = { "November" }
            key = { "November" }>
            { "November" }
          </option>
          <option
            value = { "December" }
            key = { "December" }>
            { "December" }
          </option>
        </Input>
      </div>
    );
  }
});

export default ScrubModal
