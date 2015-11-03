// Dashboard
// =========
// Default view for FreeNAS, shows overview of system and other general
// information.

"use strict";

import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";

import * as DISKS from "../actions/disks";
import * as SUBSCRIPTIONS from "../actions/subscriptions";
import * as STATD from "../actions/statd";
import * as SYSTEM from "../actions/system";
import DiskUtilities from "../utility/DiskUtilities";

import SystemInfo from "../components/Widgets/SystemInfo";
import CPU from "../components/Widgets/CPU";
import Network from "../components/Widgets/Network";
import Memory from "../components/Widgets/Memory";


// STYLESHEET
if ( process.env.BROWSER ) require( "./Dashboard.less" );


// REACT
class Dashboard extends React.Component {

  constructor( props ) {
    super( props );
    this.displayName = "Dashboard";
  }

  componentDidMount () {
    this.props.subscribe( this.displayName );
    this.props.fetchData();
  }

  componentWillUnmount () {
    this.props.unsubscribe( this.displayName );
  }

  // Only send new props if the page is visible
  shouldComponentUpdate( nextProps, nextState ) {
    return document.visibilityState === "visible";
  }

  render () {
    return (
      <main className="full dashboard">
        <div className="dashboard-widgets">

          <SystemInfo
            hostname = { this.props.hostname }
            version = { this.props.version }
            cpu_model = { this.props.hardware.cpu_model }
            cpu_cores = { this.props.hardware.cpu_cores }
            memory_size = { this.props.hardware.memory_size }
            predominantDisks = { this.props.predominantDisks }
          />

          <CPU
            fetchHistory = { ( sources, frequency ) => this.props.fetchHistory( sources, frequency ) }
            subscribe = { ( sources, id ) => this.props.pulseSubscribe( sources, id ) }
            unsubscribe = { ( sources, id ) => this.props.pulseUnsubscribe( sources, id ) }
            cpu_cores = { this.props.hardware.cpu_cores }
            statdData = { this.props.statd }
          />

          <Memory
            fetchHistory = { ( sources, frequency ) => this.props.fetchHistory( sources, frequency ) }
            subscribe = { ( sources, id ) => this.props.pulseSubscribe( sources, id ) }
            unsubscribe = { ( sources, id ) => this.props.pulseUnsubscribe( sources, id ) }
            statdData = { this.props.statd }
          />
        </div>
      </main>
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  const { disks } = state;

  return (
    { predominantDisks: DiskUtilities.predominantDisks( disks.disks )
    , hostname: state.system.general.hostname
    , hardware: state.system.info.hardware
    , version: state.system.info.version
    , statd: state.statd.data
    }
  );
}

const SUB_MASKS = [ "entity-subscriber.disks.changed" ];

function mapDispatchToProps ( dispatch ) {
  return (
    { subscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.add( SUB_MASKS, id ) )
    , unsubscribe: ( id ) =>
      dispatch( SUBSCRIPTIONS.remove( SUB_MASKS, id ) )

    // STATD DATA
    , fetchHistory: ( sources ) =>
      dispatch( STATD.fetchHistory( sources ) )
    , pulseSubscribe: ( sources, id ) =>
      dispatch( STATD.pulseSubscribe( sources, id ) )
    , pulseUnsubscribe: ( sources, id ) =>
      dispatch( STATD.pulseUnsubscribe( sources, id ) )

    // GET INITIAL DATA
    , fetchData: () => {
        dispatch( DISKS.requestDiskOverview() );
        dispatch( SYSTEM.requestHardware() );
        dispatch( SYSTEM.requestGeneralConfig() );
        dispatch( SYSTEM.requestVersion() );
      }
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Dashboard );
