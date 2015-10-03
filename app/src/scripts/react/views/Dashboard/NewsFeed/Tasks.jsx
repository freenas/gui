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
        key       = { task.id + task.state }
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
        return true;
      }
    });
  }

  processTasks ( collection ) {
    function sortTasks ( task ) {
      return task[ "updated-at" ] || task.timestamp || 0;
    }
    if ( Object.keys( collection ).length ) {
      return _.chain( collection )
        .values()
        // HACK: Empty objects seem to be finding their way in somehow
        .filter( ( task ) => { return Boolean( task.id ) } )
        .sortBy( sortTasks )
        .value()
        .reverse();
    } else {
      return [];
    }
  }

  render () {
    let { CREATED, WAITING, EXECUTING, FINISHED, FAILED } = this.props.tasks;
    const TASK_LIST = _.flatten(
      [ this.processTasks( EXECUTING )
      , this.processTasks( WAITING )
      , this.processTasks( CREATED )
      , this.cullOlderThan( this.processTasks( FINISHED )
                          , moment().subtract( 30, "minutes" )
                          )
      , this.cullOlderThan( this.processTasks( FAILED )
                          , moment().subtract( 1, "days" )
                          )
      ]
    );

    return (
      <div className="tasks-feed">
        <h4 className="news-feed-header">{ "Active Tasks" }</h4>
        <div className="task-feed-content">
          { TASK_LIST.map( this.createTask ) }
        </div>
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
