// Memory Usage Meter
// =================

"use strict";

import _ from "lodash";
import React from "react";
import { ProgressBar } from "react-bootstrap";

const DATA_SOURCES =
  [ "localhost.memory.memory-active.value"
  , "localhost.memory.memory-cache.value"
  , "localhost.memory.memory-wired.value"
  , "localhost.memory.memory-inactive.value"
  , "localhost.memory.memory-free.value"
  ];

class MemoryMeter extends React.Component {
  constructor ( props ) {
    super( props );

    this.displayName = "Memory Meter";
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
    const ACTIVE   = this.getLatestValueFor( "localhost.memory.memory-active.value" );
    const CACHE    = this.getLatestValueFor( "localhost.memory.memory-cache.value" );
    const WIRED    = this.getLatestValueFor( "localhost.memory.memory-wired.value" );
    const INACTIVE = this.getLatestValueFor( "localhost.memory.memory-inactive.value" );
    const FREE     = this.getLatestValueFor( "localhost.memory.memory-free.value" );

    let hasAllData = false;
    let visiblePercent = "";
    let percentages =
      { ACTIVE   : 0
      , CACHE    : 0
      , WIRED    : 0
      };

    if ( _.every([ ACTIVE, CACHE, WIRED, INACTIVE, FREE ], value => typeof value === "number" )) {
      const USED = ( ACTIVE + CACHE + WIRED );
      const TOTAL = ( USED + INACTIVE + FREE );

      hasAllData = true;
      visiblePercent = `${ Math.round( ( USED / TOTAL ) * 100 ) }%`;
      percentages =
        { ACTIVE   : Math.round( ( ACTIVE / TOTAL ) * 100 )
        , CACHE    : Math.round( ( CACHE / TOTAL ) * 100 )
        , WIRED    : Math.round( ( WIRED / TOTAL ) * 100 )
        };
    }

    // TODO: Right now, everything is visually aggregated into progress
    // bars that all use the same style. Later on, if we want to create a
    // behavior to show them as different values / with labels, we can do so.

    return (
      <div className="basic-meter">
        <h5>
          <span>Memory</span>
          <span className="pull-right percentage">{ visiblePercent }</span>
        </h5>
        <ProgressBar>
          <ProgressBar
            key = { 0 }
            active = { !hasAllData }
            now = { hasAllData
                  ? percentages.ACTIVE
                  : 100
                  }
            bsStyle = "primary"
          />
          <ProgressBar
            key = { 1 }
            now = { hasAllData
                  ? percentages.CACHE
                  : 0
                  }
            bsStyle = "primary"
          />
          <ProgressBar
            key = { 2 }
            now = { hasAllData
                  ? percentages.WIRED
                  : 0
                  }
            bsStyle = "primary"
          />
        </ProgressBar>
      </div>
    );
  }
}

export default MemoryMeter;
