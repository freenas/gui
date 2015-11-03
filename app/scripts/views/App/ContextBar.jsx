// Context Bar
// ===============
// Part of the main webapp's window chrome. Positioned on the right side of the
// page, this bar shows user-customizable content including graphs, logged in
// users, and other widgets.

"use strict";

import React from "react";
import { connect } from "react-redux";

import * as STATD from "../../actions/statd";

import MemoryMeter from "../../components/Widgets/MemoryMeter";
import CPUMeter from "../../components/Widgets/CPUMeter";
import TopologyEditContext from "../Storage/contexts/TopologyEditContext";
import Task from "./ContextBar/Task";

// STYLESHEET
if ( process.env.BROWSER ) require( "./ContextBar.less" );


// REACT
class ContextBar extends React.Component {
  createTask ( task, index ) {
    let hideAfter;

    switch ( task.state ) {
      case "FINISHED":
        hideAfter = 20000;
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

  getActiveComponent() {
    if ( this.props.location ) {
      switch ( this.props.location.pathname ) {
        case "/storage":
          if ( this.props.volumes.activeVolume ) {
            if ( this.props.volumes.clientVolumes.hasOwnProperty( this.props.volumes.activeVolume ) ) {
              return <TopologyEditContext />;
            } else if ( this.props.volumes.serverVolumes.hasOwnProperty( this.props.volumes.activeVolume ) ) {
              // TODO: The thing for volumes that exist
            }
          }
      }
    }

    // Placeholder to ensure that space is properly maintained
    return <div className="context-content"/>;
  }

  render () {
    return (
      <aside className="app-sidebar" >

        {/* ACTIVE TASKS */}
        <div className="feed">
          <h5 className="context-section-header type-line">
            <span className="text">Active Tasks</span>
          </h5>
          <div className="feed-content">
            { Object.keys( this.props.tasks ).map( id =>
              this.createTask( this.props.tasks[ id ] )
            )}
          </div>
        </div>


        {/* CONTEXTUAL CONTENT */}
        { this.getActiveComponent() }


        {/* MINI DASHBOARD */}
        <div className="context-dashboard">
          <CPUMeter
            fetchHistory = { ( sources ) => this.props.fetchHistory( sources ) }
            subscribe = { ( sources, id ) => this.props.pulseSubscribe( sources, id ) }
            unsubscribe = { ( sources, id ) => this.props.pulseUnsubscribe( sources, id ) }
            statdData = { this.props.statd }
          />
          <MemoryMeter
            fetchHistory = { ( sources ) => this.props.fetchHistory( sources ) }
            subscribe = { ( sources, id ) => this.props.pulseSubscribe( sources, id ) }
            unsubscribe = { ( sources, id ) => this.props.pulseUnsubscribe( sources, id ) }
            statdData = { this.props.statd }
          />
        </div>

      </aside>
    );
  }
}

ContextBar.propTypes =
  { location: React.PropTypes.object
  , volumes: React.PropTypes.object // TODO: Ahahahaha, good grief. :(
  , statd: React.PropTypes.object
  , tasks: React.PropTypes.object
  }


// REDUX
function mapStateToProps ( state ) {
  return { volumes: state.volumes
         , statd: state.statd.data
         , tasks: state.tasks.tasks
         };
}

function mapDispatchToProps ( dispatch ) {
  return (
    // STATD DATA
    { fetchHistory: ( sources ) =>
      dispatch( STATD.fetchHistory( sources ) )

    , pulseSubscribe: ( sources, id ) => {
      dispatch( STATD.pulseSubscribe( sources, id ) )
    }
    , pulseUnsubscribe: ( sources, id ) =>
      dispatch( STATD.pulseUnsubscribe( sources, id ) )
    }
  );
}


export default connect( mapStateToProps, mapDispatchToProps )( ContextBar );
