// EXISTING VOLUME HEADER
// ======================
// Display for a volume which has already been initialized, including a general
// overview of things like its health, total capacity, etc.

"use strict";

import React from "react";

import ByteCalc from "../../../../utility/ByteCalc";

import BreakdownChart from "./BreakdownChart";

export default class ExistingVolumeHeader extends React.Component {
  render () {
    return (
      <div className="volume-info">
        <div className="clearfix">

          {/* POOL NAME AND HEALTH INDICATOR */}
          <h3 className="pull-left volume-name">
            { this.props.volumeName }
          </h3>

          {/* TOTAL CAPACITY */}
          <h3 className="pull-right volume-capacity">
            { ByteCalc.humanize( this.props.topologyBreakdown.avail ) }
          </h3>
        </div>

        {/* TOPOLOGY BREAKDOWN */}
        <BreakdownChart
          parity = { this.props.topologyBreakdown.parity }
          used   = { this.props.topologyBreakdown.used }
          free   = { this.props.topologyBreakdown.avail }
        />
      </div>
    );
  }
}

ExistingVolumeHeader.propTypes =
  { volumeName        : React.PropTypes.string.isRequired
  , topologyBreakdown : React.PropTypes.shape(
      { parity : React.PropTypes.number.isRequired
      , avail  : React.PropTypes.number.isRequired
      , used   : React.PropTypes.number.isRequired
      }
    )
  };
