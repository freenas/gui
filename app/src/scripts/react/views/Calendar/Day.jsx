// Day
// ===
// Component representing a day of a month

"use strict";

import React from "react";

import DragTarget from "../../components/DragTarget";
import DropTarget from "../../components/DropTarget";


const Day = React.createClass (
  { propTypes: { handleTaskAdd: React.PropTypes.func.isRequired
               , chooseDay: React.PropTypes.func.isRequired
               // Whether this is today's date
               , isToday: React.PropTypes.bool.isRequired
               // Whether this is the day selected by the user
               , isSelected: React.PropTypes.bool.isRequired
               // The day of the month this represents
               , dayOfMonth: React.PropTypes.number.isRequired
               , index: React.PropTypes.number.isRequired
               }

  , getDefaultProps () {
    return { isToday: false };
  }

  , render () {
    var dayClass = [ "day" ];

    if ( this.props.isToday ) {
      dayClass.push( "today" );
    }
    if ( this.props.isSelected ) {
      dayClass.push( "selected" );
    }

    return (
      <div
        key={ this.props.index }
        className= { dayClass.join( " " ) }
        onClick = { this.props.chooseDay.bind( null, this.props.dayOfMonth ) }
      >
        <DropTarget
          className="day-content"
          callback={ this.props.handleTaskAdd }
          namespace="calendar"
          activeDrop>
          <span className="day-numeral">{ this.props.dayOfMonth }</span>
        </DropTarget>
      </div>
    );
  }
});

export default Day;
