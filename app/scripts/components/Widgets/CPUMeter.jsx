// CPU Usage Meter
// ===============

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";

const DATA_SOURCES =
  [ "localhost.aggregation-cpu-sum.cpu-system.value"
  , "localhost.aggregation-cpu-sum.cpu-user.value"
  ];

class CPUMeter extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "CPU Meter";
  }

  componentDidMount () {
    this.props.fetchHistory( DATA_SOURCES );
    this.props.subscribe( DATA_SOURCES, this.displayName );
  }

  componentWillUnmount () {
    this.props.unsubscribe( DATA_SOURCES, this.displayName );
  }

  getLatestValueFor( valueType ) {
    if ( Array.isArray( this.props.statdData[ valueType ] )
      && Array.isArray( this.props.statdData[ valueType ][0] ) ) {
      const VALUE = Number( this.props.statdData[ valueType ][0][1] );

      if ( !isNaN( VALUE ) ) return VALUE;
    }

    return null;
  }

  render () {
    const USER = this.getLatestValueFor( "localhost.aggregation-cpu-sum.cpu-user.value" );
    const SYSTEM = this.getLatestValueFor( "localhost.aggregation-cpu-sum.cpu-system.value" );

    const PERCENT = ( typeof USER !== "number" && typeof SYSTEM !== "number" )
                  ? ""
                  : `${ Math.round( USER + SYSTEM ) }%`;

    // TODO: Right now, USER and SYSTEM are visually aggregated into progress
    // bars that both use the same style. Later on, if we want to create a
    // behavior to show them as different values / with labels, we can do so.

    return (
      <div className="basic-meter">
        <h5>
          <span>CPU</span>
          <span className="pull-right percentage">{ PERCENT }</span>
        </h5>
        <ProgressBar>
          <ProgressBar
            key = { 0 }
            active = { typeof USER !== "number" }
            now = { typeof USER !== "number"
                  ? 100
                  : USER
                  }
            bsStyle = "primary"
          />
          <ProgressBar
            key = { 1 }
            now = { typeof SYSTEM !== "number"
                  ? 100
                  : SYSTEM
                  }
            bsStyle = "primary"
          />
        </ProgressBar>
      </div>
    );
  }
}

CPUMeter.propTypes =
  { subscribe: React.PropTypes.func.isRequired
  , unsubscribe: React.PropTypes.func.isRequired
  , statdData: React.PropTypes.object.isRequired
  };

export default CPUMeter;
