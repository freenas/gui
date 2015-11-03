// Dashboard Widgets Context
// =========================
// Sidebar with additional system stats widgets.

"use strict";

import React from "react";
import { connect } from "react-redux";

import * as STATD from "../../actions/statd";

import MemoryMeter from "../../components/Widgets/MemoryMeter";
import CPUMeter from "../../components/Widgets/CPUMeter";
import NewsFeed from "./NewsFeed";


// STYLESHEET
if ( process.env.BROWSER ) require( "./DashboardContext.less" );


// REACT
class DashboardContext extends React.Component {
  render() {
    return (
      <div className="context-dashboard">
        <NewsFeed/>
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
    );
  }
}


// REDUX
function mapStateToProps ( state ) {
  return { statd: state.statd.data };
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

export default connect( mapStateToProps, mapDispatchToProps )( DashboardContext );
