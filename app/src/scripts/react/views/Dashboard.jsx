// Dashboard
// =========
// Default view for FreeNAS, shows overview of system and other general
// information.

"use strict";

import React from "react";
import moment from "moment";

import DM from "../../flux/middleware/DisksMiddleware";
import DS from "../../flux/stores/DisksStore";

import SM from "../../flux/middleware/StatdMiddleware";
import SS from "../../flux/stores/StatdStore";

import SystemMiddleware from "../../flux/middleware/SystemMiddleware";
import SystemStore from "../../flux/stores/SystemStore";

import SystemInfo from "../components/Widgets/SystemInfo";
import CPU from "../components/Widgets/CPU";
import Network from "../components/Widgets/Network";
import Memory from "../components/Widgets/Memory";
import DashboardContext from "./Dashboard/DashboardContext";

function getSystemInformation () {
  return _.merge( SystemStore.getSystemInfo( "hardware" )
                , SystemStore.systemGeneralConfig
                , { version: SystemStore.version }
                );
}

function getPredominantDisks () {
  let predominantDisks = DS.predominantDisks;

  return { predominantDisks: predominantDisks };
}

export default class Dashboard extends React.Component {

  constructor( props ) {
    super( props );
    this.displayName = "Dashboard";
    this.state = { dataSourceGroups: [] };
  }

  componentDidMount () {
    document.addEventListener( "visibilitychange"
                             , this.handleVisibilityChange.bind( this )
                             );

    DS.addChangeListener( this.handleDisksChange.bind( this ) );
    DM.requestDisksOverview();
    DM.subscribe( this.displayName );

    SS.addChangeListener( this.handleDataUpdate.bind( this ) );

    SystemMiddleware.subscribe( this.displayName );
    SystemStore.addChangeListener( this.handleHardwareChange.bind( this ) );
    SystemMiddleware.requestSystemInfo( "hardware" );
    SystemMiddleware.requestSystemGeneralConfig();
    SystemMiddleware.requestVersion();

  }

  componentWillUnmount () {
    document.removeEventListener( "visibilitychange"
                                , this.handleVisibilityChange.bind( this )
                                );

    // Unsubscribe from all data sources
    this.state.dataSourceGroups.forEach( function unsubscribeAll( dataSourceGroup ) {
      SM.unsubscribeFromPulse( this.displayName, dataSourceGroup );
    }, this );

    DS.removeChangeListener( this.handleDisksChange.bind( this ) );
    DM.unsubscribe( this.displayName );

    SS.removeChangeListener( this.handleDataUpdate.bind( this ) );

    SystemStore.removeChangeListener( this.handleHardwareChange.bind( this ) );
    SystemMiddleware.unsubscribe( this.displayName );
  }

  handleDisksChange () {
    this.setState( getPredominantDisks() );
  }

  handleHardwareChange () {
    this.setState( getSystemInformation() );
  }

  handleVisibilityChange ( event ) {
    if ( document.visibilityState ) {
      this.state.dataSourceGroups.forEach( function subscribeAll ( dataSourceGroup ) {
        SM.subscribeToPulse( this.displayName, dataSourceGroup );
      }, this );
      this.setState( { subscriptionsActive: true } );
    } else {
      this.state.dataSourceGroups.forEach( function unsubscribeAll( dataSourceGroup ) {
        SM.unsubscribeFromPulse( this.displayName, dataSourceGroup );
      }, this );
      this.setState( { subscriptionsActive: false } );
    }
  }

  subscribeToDataSources ( dataSourceGroup, frequency ) {
    var newDataSourceGroups = this.state.dataSourceGroups.slice();
    newDataSourceGroups.push( dataSourceGroup );
    this.setState( { dataSourceGroups: newDataSourceGroups } );
    SM.subscribeToPulse( this.displayName, dataSourceGroup );

    const now = moment().format();
    // Hardcoded to the past 60 seconds of data.
    const startTime = moment( now ).subtract( frequency * 60, "seconds" ).format();

    dataSourceGroup.forEach( function requestInitialData( dataSource ) {
                             SM.requestWidgetData( dataSource
                                                 , startTime
                                                 , now
                                                 , frequency + "S"
                                                 );
                            }
                         );
  }

  handleDataUpdate ( eventMask ) {

  }

  render () {
    return (
      <main className="full dashboard">
        <div className="dashboard-widgets">

          <SystemInfo { ...this.state } />

          <CPU subscribeToDataSources = { this.subscribeToDataSources.bind( this ) } />

          <Network />

          <Memory />
        </div>
      </main>
    );
  }
}
