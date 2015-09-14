// Task Schedule
// =============
// Component for modifying the schedule of a calendar task.

"use strict";

import React from "react";
import { Input } from "react-bootstrap";


function generateDayOptions ( month, year ) {
  var dayOptions = [];

  dayOptions.push(
    <option
      key = { "*" }
      value = { "*" }>
      { "All" }
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

function generateYearOptions () {
  var yearOptions = [];

  yearOptions.push(
    <option
      key = { "*" }
      value = { "*" }>
      { "All" }
    </option>
  );

  for ( let i = 2015; i < 2039; i++ ) {
    yearOptions.push(
      <option
        key = { i }
        value = { i.toString() }>
        { i }
      </option>
    );
  }
  return yearOptions;
}

const TaskSchedule = React.createClass(
  { propTypes: { day_of_week: React.PropTypes.string
               , week: React.PropTypes.string
               , day: React.PropTypes.string
               , month: React.PropTypes.string
               , year: React.PropTypes.string
               // , second: React.PropTypes.string
               // , minute: React.PropTypes.string
               // , hour: React.PropTypes.string
               , coalesce: React.PropTypes.bool
               , handleChange: React.PropTypes.func.isRequired
               }

  , render () {
    return (
      <div>
        <Input
          type = "select"
          onChange = { this.props.handleChange.bind( null, "day_of_week" ) }
          value = { this.props.day_of_week }
          label = "Weekday">
          <option
            value = { "*" }
            key = { "*" }>
            { "All" }
          </option>
          <option
            value = { "sun" }
            key = { "sun" }>
            { "Sunday" }
          </option>
          <option
            value = { "mon" }
            key = { "mon" }>
            { "Monday" }
          </option>
          <option
            value = { "tue" }
            key = { "tue" }>
            { "Tuesday" }
          </option>
          <option
            value = { "wed" }
            key = { "wed" }>
            { "Wednesday" }
          </option>
          <option
            value = { "thu" }
            key = { "thu" }>
            { "Thursday" }
          </option>
          <option
            value = { "fri" }
            key = { "fri" }>
            { "Friday" }
          </option>
          <option
            value = { "sat" }
            key = { "sat" }>
            { "Saturday" }
          </option>
        </Input>
        <Input
          type = "select"
          onChange = { this.props.handleChange.bind( null, "day" ) }
          value = { this.props.day }
          label = "Day">
          { generateDayOptions( this.props.month, this.props.year ) }
        </Input>
        <Input
          type = "select"
          onChange = { this.props.handleChange.bind( null, "month" ) }
          value = { this.props.month }
          label = "Month">
          <option
            value = { "*" }
            key = { "*" }>
            { "All" }
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
          onChange = { this.props.handleChange.bind( null, "year" ) }
          value = { this.props.year }
          label = "Year">
          { generateYearOptions() }
        </Input>
      </div>
    );
  }
});

export default TaskSchedule;
