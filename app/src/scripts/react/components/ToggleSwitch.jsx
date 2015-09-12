// TOGGLE SWITCH
// =============
// A simple boolean toggle switch that performs the same functionality as a
// checkbox.

"use strict";

import React from "react";

const ToggleSwitch = React.createClass(
  { propTypes: { toggled  : React.PropTypes.bool
               , disabled : React.PropTypes.bool
               , onChange : React.PropTypes.func
               , small    : React.PropTypes.string
               , sm       : React.PropTypes.string
    }

  , getDefaultProps () {
      return { toggled: false
             , disabled: false
             , onChange: function ( toggleState, reactID ) {
                 console.warn( "No onChange handler was provided for"
                               + " ToggleSwitch"
                             , reactID );
               }
             };
    }

  , handleToggleClick: function ( event, reactID ) {
      event.stopPropagation();
      event.preventDefault();

      this.props.onChange( !this.props.toggled, reactID );
    }

  , render () {
      var toggleClasses = [ "toggle-switch" ];

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
);

export default ToggleSwitch;
