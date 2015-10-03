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

export default class Tasks extends React.Component {
  createTask ( task, index ) {
    let hideAfter;

    switch ( task.state ) {
      case "FINISHED":
        hideAfter = 60000;
        break;
    }

    return (
      <Task
        { ...task }
        key       = { index }
        hideAfter = { hideAfter }
      />
    );
  }

  cullOlderThan ( tasksObject, age ) {
    // Reduce a collection of tasks to only those which happened after `age`
    return _.filter( tasksObject, ( task ) => {
      if ( task.finished_at ) {
        return moment.utc( task.finished_at ).isAfter( age );
      } else {
        return false;
      }
    });
  }

  createTaskList ( tasksCollection ) {
    function sortTasks ( task ) {
      return task[ "updated-at" ] || task.timestamp || 0;
    }

    return _.chain( tasksCollection )
     .filter( ( collection ) => { return Object.keys( collection ).length } )
     .flatten()
     // HACK: Empty objects seem to be finding their way in somehow
     .filter( ( task ) => { return Boolean( task.id ) } )
     .sortBy( sortTasks )
     .value();
  }

  render () {
    let { CREATED, WAITING, EXECUTING, FINISHED, FAILED } = this.props.tasks;
    const TASK_LIST = this.createTaskList(
      [ _.values( CREATED )
      , _.values( WAITING )
      , _.values( EXECUTING )
      , this.cullOlderThan( FINISHED, moment().subtract( 30, "minutes" ) )
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
