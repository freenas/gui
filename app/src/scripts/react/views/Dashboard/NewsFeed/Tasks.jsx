// TASKS FEED
// ==========
// Show ongoing system tasks, and contextually hide when no tasks are ongoing.

"use strict";

import _ from "lodash";
import React from "react";
import moment from "moment";

import Task from "./Task";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Tasks.less" );

const EXPIRY = 5000;

export default class Tasks extends React.Component {
  createTask ( task, index ) {
    return (
      <Task
        { ...task }
        key = { index }
      />
    );
  }

  cullOlderThan ( tasksObject, age ) {
    // Reduce a collection of tasks to only those which happened after `age`
    return _.filter( tasksObject, ( task ) => {
      return moment( task[ "updated-at" ] ).isAfter( age );
    });
  }

  createTaskList ( taskCollection ) {
    return _.chain( taskCollection )
     .flatten()
     .sortBy( "updated-at" )
     .value()
     .reverse();
  }

  render () {
    let { CREATED, WAITING, EXECUTING, FINISHED, FAILED } = this.props.tasks;
    const TASK_LIST = this.createTaskList(
      [ CREATED
      , WAITING
      , EXECUTING
      , this.cullOlderThan( FINISHED, moment().subtract( 5, "minutes" ) )
      , this.cullOlderThan( FAILED, moment().subtract( 1, "days" ) )
      ]
    );

    return (
      <div className="tasks-feed">
        <h4 className="news-feed-header">{ "Active Tasks" }</h4>
        { TASK_LIST.map( this.createTask ) }
      </div>
    );
  }
};

Tasks.propTypes =
  { tasks: React.PropTypes.shape(
      { CREATED   : React.PropTypes.object
      , WAITING   : React.PropTypes.object
      , EXECUTING : React.PropTypes.object
      , FINISHED  : React.PropTypes.object
      , FAILED    : React.PropTypes.object
      , ABORTED   : React.PropTypes.object
      }
    )
  };
