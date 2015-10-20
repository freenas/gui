// VOLUME TASK
// ===========
// Show ongoing progress for a Volume-related task.

"use strict";

import React from "react";

import { ProgressBar } from "react-bootstrap";

// STYLESHEET
if ( process.env.BROWSER ) require( "./VolumeTask.less" );


const MESSAGES =
  { "volume.create":
    { CREATED: "Setting up volume creation task..."
    , WAITING: "Waiting for resources..."
    , EXECUTING: "Creating volume"
    }
  , "volume.destroy":
    { CREATED: "Setting up volume destruction task..."
    , WAITING: "Waiting for resources..."
    , EXECUTING: "Destroying volume"
    }
  };

export default class VolumeTask extends React.Component {
  render () {
    let content = null;
    const { name, percentage, state } = this.props;

    if ( state ) {
      let progressProps = {};

      switch ( state ) {
        case "EXECUTING":
          progressProps.now = percentage;
          break;

        default:
          progressProps.now    = 100;
          progressProps.active = true;
          break;
      }

      content = (
        <div className="volume-task">
          <h2 className="volume-task-message">
            { MESSAGES[ name ][ state ] }
          </h2>
          <ProgressBar { ...progressProps } />
        </div>
      );
    }

    return content;
  }
}

VolumeTask.propTypes =
  { abortable  : React.PropTypes.bool
  , id         : React.PropTypes.number
  , message    : React.PropTypes.string
  , name       : React.PropTypes.oneOf([ "volume.create", "volume.destroy" ])
  , percentage : React.PropTypes.number
  , state      : React.PropTypes.oneOf([ "CREATED", "WAITING", "EXECUTING" ])
  , timestamp  : React.PropTypes.number
  };
