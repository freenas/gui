// Task Item
// =========
// Displays information about a single task.

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";
import moment from "moment";

import DiscTri from "../../../components/DiscTri";

var Velocity;

// WEBPACK SHIMS
if ( process.env.BROWSER ) {
  require( "./Task.less" );
  Velocity = require( "velocity-animate" );
} else {
  Velocity = () => { return Promise().resolve( true ); };
}

export default class Task extends React.Component {
  componentDidMount () {
    if ( this.props.hideAfter ) {
      this.queueContentHide();
    }
  }

  componentDidUpdate ( prevProps, prevState ) {
    if ( this.props.hideAfter && !prevProps.hideAfter ) {
      this.queueContentHide();
    }
  }

  queueContentHide () {
    // Make sure function can only be run once
    this.queueContentHide = function () {};

    Velocity( React.findDOMNode( this.refs.taskContent )
           , { height        : 0
             , marginTop     : 0
             , marginBottom  : 0
             , paddingTop    : 0
             , paddingBottom : 0
             , opacity       : 0
             , transform     : "translateY( 15px )"
             }
           , { display: "none" }
           , { duration : 250
             , delay    : this.props.hideAfter
             }
           );
  }

  render () {
    var progressProps = { bsStyle: "primary" };
    if ( _.has( this, [ "props", "progress", "percentage" ] ) ) {
      progressProps.now = this.props.progress.percentage;
    }
    var cancelBtn = null; // TODO: implement cancelBtn

    switch ( this.props.state ) {
      case "CREATED":
        progressProps.active = true;
        progressProps.now = 100;
        break;
      case "WAITING":
        progressProps.active = true;
        progressProps.now = 100;
        break;
      case "EXECUTING":
        progressProps.now = progressProps.now || 0;
        break;
      case "FINISHED":
        progressProps.now = 100;
        break;
      case "FAILED":
        progressProps.bsStyle = "danger";
        progressProps.now = 100;
        break;
      case "ABORTED":
        progressProps.bsStyle = "warning";
        progressProps.now = 100;
        break;
    }

    const HEADER = (
      <div className="task-header">
        <h5 className="task-title">{ this.props.name }</h5>
        <ProgressBar { ...progressProps } />
      </div>
    );

    return (
      <div
        ref = "taskContent"
        className = "task-item"
      >
        <DiscTri
          headerShow = { HEADER }
          headerHide = { HEADER }
          defaultExpanded = { false }
        >
          <div className="task-details">
            <div className="clearfix">
              <h6 className="task-timestamp">
                { moment( this.props[ "updated-at" ] )
                    .format( "L, h:mm:ss a" )
                }
              </h6>
              <h6 className="task-timestamp" /*separate out style */>
                { this.props.user
                ? "User: " + this.props.user
                : null
                }
              </h6>
            </div>
          </div>
        </DiscTri>
      </div>
    );
  }
}

Task.propTypes =
  { hideAfter: React.PropTypes.number
  };
