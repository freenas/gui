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
    this.state = { statdData: {} };
  }

  componentDidMount () {
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
    // Unsubscribe from all data sources
    var dataSources = _.keys[ this.state.statdData ];
    SM.unsubscribeFromPulse( this.displayName, dataSources );

    DS.removeChangeListener( this.handleDisksChange.bind( this ) );
    DM.unsubscribe( this.displayName );

    SS.removeChangeListener( this.handleDataUpdate.bind( this ) );

    SystemStore.removeChangeListener( this.handleHardwareChange.bind( this ) );
    SystemMiddleware.unsubscribe( this.displayName );
  }

  // Only send new props if the page is visible
  shouldComponentUpdate( nextProps, nextState ) {
    return document.visibilityState === "visible";
  }

  handleDisksChange () {
    this.setState( getPredominantDisks() );
  }

  handleHardwareChange () {
    this.setState( getSystemInformation() );
  }

  subscribeToDataSources ( newDataSources, frequency ) {
    var newStatdData = _.cloneDeep( this.state.statdData );

    SM.subscribeToPulse( this.displayName, newDataSources );

    const now = moment().format();
    // Hardcoded to the past 60 seconds of data.
    const startTime = moment( now ).subtract( frequency * 60, "seconds" ).format();

    newDataSources.forEach( function requestInitialData( dataSource ) {
                               // Don't toss out old data if there is any
                               if ( _.isEmpty( newStatdData[ dataSource ] ) ) {
                                 newStatdData[ dataSource ] = [];
                               }
                               SM.requestWidgetData( dataSource
                                                   , startTime
                                                   , now
                                                   , frequency + "S"
                                                   );
                            }
                         );
    this.setState( { statdData: newStatdData } );
  }

  handleDataUpdate ( eventMask ) {
    var dataSourceToUpdate = eventMask.split( " " )[0];
    var newStatdData = this.state.statdData;
    newStatdData[ dataSourceToUpdate ] = SS.getStatdData( dataSourceToUpdate );
    this.setState( { statdData: newStatdData } );
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
