// Task Item
// =========
// Displays information about a single task.

"use strict";

import React from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";
import moment from "moment";

import DiscTri from "../../../components/DiscTri";

export default class TaskItem extends React.Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    var progressProps = { now: this.props.percentage };
    var cancelBtn = null; // TODO: implement cancelBtn

    switch ( this.props.state ) {
      case "WAITING":
        progressProps.active = true;
        progressProps.label = "Waiting...";
        break;
      case "EXECUTING":
        progressProps.active = true;
        progressProps.label = "Executing...";
        break;
      case "FINISHED":
        progressProps.bsStyle = "success";
        progressProps.label = "Completed";
        break;
      case "FAILED":
        progressProps.bsStyle = "danger";
        progressProps.label = "Failed";
        break;
      case "ABORTED":
        progressProps.bsStyle = "warning";
        progressProps.label = "Aborted";
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
                { moment( this.props.timestamp * 1000 )
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
            <hr />
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
