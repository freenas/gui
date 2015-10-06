// TOGGLE SWITCH
// =============
// A simple boolean toggle switch that performs the same functionality as a
// checkbox.

"use strict";

import React from "react";

export default class ToggleSwitch extends React.Component {

  handleToggleClick ( event, reactID ) {
    event.stopPropagation();
    event.preventDefault();

    this.props.onChange( !this.props.toggled, reactID );
  }

  render () {
    let toggleClasses = [ "toggle-switch" ];

    if ( this.props.toggled ) {
      toggleClasses.push( "on" );
    }

    if ( this.props.disabled ) {
      toggleClasses.push( "disabled" );
    }

    if ( this.props.sm || this.props.small ) {
      toggleClasses.push( "toggle-switch-sm" );
    }

    return (
      <div
        className = { toggleClasses.join( " " ) }
        onClick   = { this.props.disabled
                    ? null
                    : this.handleToggleClick
                    }
      />
    );
  }

}

ToggleSwitch.propTypes =
  { toggled  : React.PropTypes.bool
  , disabled : React.PropTypes.bool
  , onChange : React.PropTypes.func
  , small    : React.PropTypes.bool
  , sm       : React.PropTypes.bool
  };

ToggleSwitch.defaultProps =
  { toggled: false
  , disabled: false
  , onChange: function ( toggleState, reactID ) {
      console.warn( "No onChange handler was provided for"
                  + " ToggleSwitch"
                  , reactID
                  );
    }
  };
