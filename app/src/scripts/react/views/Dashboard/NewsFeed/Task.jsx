// Task Item
// =========
// Displays information about a single task.

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";
import moment from "moment";

import DiscTri from "../../../components/DiscTri";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Task.less" );

export default class Task extends React.Component {

  render () {
    var progressProps = { bsStyle: "primary" };
    if ( _.has( this, [ "props", "progress", "percentage" ] ) ) {
      progressProps.now = this.props.progress.percentage;
    }
    var cancelBtn = null; // TODO: implement cancelBtn

    switch ( this.props.state ) {
      case "CREATED":
        progressProps.active = true;
        progressProps.label = "Created";
        progressProps.now = 100;
        break;
      case "WAITING":
        progressProps.active = true;
        progressProps.label = "Waiting...";
        progressProps.now = 100;
        break;
      case "EXECUTING":
        progressProps.now = progressProps.now || 0;
        break;
      case "FINISHED":
        progressProps.label = "Complete";
        progressProps.now = 100;
        break;
      case "FAILED":
        progressProps.bsStyle = "danger";
        progressProps.label = "Failed";
        progressProps.now = 100;
        break;
      case "ABORTED":
        progressProps.label = "Aborted";
        progressProps.now = 100;
        break;
    }

    return (
      <DiscTri
        headerShow = { this.props.name }
        headerHide = { this.props.name }
        defaultExpanded = { false }
      >
        <div className = "task-item">
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
            <div className = "clearfix">
              { cancelBtn }
              <ProgressBar { ...progressProps } />
            </div>
          </div>
        </div>
      </DiscTri>
    );
  }
}
