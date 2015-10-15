// SMART Configuration
// ===================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const POWER_MODES = [ "NEVER"
                    , "SLEEP"
                    , "STANDBY"
                    , "IDLE"
                    ];

function createDropdownOptions ( optionArray ) {
  var options =
    optionArray.map( function mapOptions ( optionValue, index ) {
                       return (
                         <option
                           value = { optionValue }
                           key = { index }>
                           { optionValue }
                         </option>
                       );
                     }
                   );
  return options;
}

export default class SMART extends React.Component {
  constructor ( props ) {
    super( props );
  }



  render () {

    const toggleService = (
      <div className = "pull-right" >
        <ToggleSwitch
          toggled = { true }
        />
      </div>
    );

    const powerMode = (
      <Input
        type = "select"
        label = "Power Mode"
        value = { this.props.power_mode }
      >
        { createDropdownOptions( POWER_MODES ) }
      </Input>
    );

    const tempDifference = (
      <Input
        type = "text"
        label = "Temperature Difference"
        value = { this.props.port }
      />
    );

    const temp_difference = (
      <Input
        type = "text"
        label = "Temperature Difference"
        value = { this.props.temp_difference }
      />
    );

    const interval = (
      <Input
        type = "text"
        label = "Interval"
        value = { this.props.interval }
      />
    );

    const tempInformational = (
      <Input
        type = "text"
        label = "Temperature Informational"
        value = { this.props.temp_informational }
      />
    );

    const tempCritical = (
      <Input
        type = "text"
        label = "Temperature Critical"
        value = { this.props.temp_critical }
      />
    );

    const formControlButtons = (
      <ButtonToolbar className = "pull-right">
        <Button
          bsStyle = "default"
        >
          { "Reset" }
        </Button>
        <Button
          bsStyle = "primary"
        >
          { "Apply" }
        </Button>
      </ButtonToolbar>
    );

    return (
      <Panel>
        <h4>S.M.A.R.T.</h4>
        { toggleService }
        <form className = "settings-config-form">
          { powerMode }
          { tempDifference }
          { interval }
          { tempInformational }
          { tempCritical }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
};

SMART.propTypes = { power_mode: React.PropTypes.oneOf( POWER_MODES )
                  , temp_difference: React.PropTypes.number
                  , interval: React.PropTypes.number
                  , temp_informational: React.PropTypes.number
                  , temp_critical: React.PropTypes.number
                  };
