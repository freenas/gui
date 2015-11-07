// CLIENT ENTRYPOINT
// =================
// Counterpart to ./index.js. client provides interface to the rest of the app,
// and wraps the app's routes component.

"use strict";

require( "babel/polyfill" );

import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Provider } from "react-redux";
import createBrowserHistory from "history/lib/createBrowserHistory";

import configureStore from "./store/configureStore";
import * as AUTH from "./actions/auth";
import * as DISKS from "./actions/disks";
import * as EVENTS from "./actions/events";
import * as RPC from "./actions/rpc";
import * as SHARES from "./actions/shares";
import * as STATD from "./actions/statd";
import * as SUBSCRIPTIONS from "./actions/subscriptions";
import * as TASKS from "./actions/tasks";
import * as VOLUMES from "./actions/volumes";
import * as WEBSOCKET from "./actions/websocket";

import routes from "./routes";
import TargetHost from "./websocket/TargetHost";
import ConnectionHandler from "./websocket/ConnectionHandler";
import MiddlewareClient from "./websocket/MiddlewareClient";


const CORE_SUBSCRIPTIONS =
  // TASKS
  [ "entity-subscriber.task.changed"
  , "task.progress"

  // EVENTS
  , "server.client_login"
  , "server.client_logout"
  , "system.device.changed"
  , "system.device.detached"
  , "system.network.interface.attached"
  , "system.network.interface.detached"
  , "system.network.interface.link_down"
  , "system.network.interface.link_up"
  , "users.changed"
  , "groups.changed"
  , "shares.changed"
  , "update.changed"
  , "volumes.changed"
  ];

const STORAGE_SUBSCRIPTIONS =
  [ "entity-subscriber.volumes.changed"
  , "entity-subscriber.disks.changed"
  , "entity-subscriber.shares.changed"
  ];


if ( process.env.BROWSER ) {
  const store = configureStore();
  const reconnect = new ConnectionHandler( store );
  const history = createBrowserHistory();
  const { protocol, host, path, mode } = TargetHost.connection();

  MiddlewareClient.bindStore( store );

  MiddlewareClient.bindHandlers(
    { onSockStateChange: ( state, closeEvent ) =>
      store.dispatch( WEBSOCKET.changeSockState( state, closeEvent ) )

    , onLogout: () =>
      store.dispatch( AUTH.logout() )


    // RPC QUEUE
    , onRPCEnqueue: ( request ) =>
      store.dispatch( RPC.enqueueRPCRequest( request ) )
    , onRPCDequeue: () =>
      store.dispatch( RPC.dequeueRPCRequests() )

    // RPC LIFECYCLE
    , onRPCRequest: ( UUID, params ) =>
      store.dispatch( RPC.submitRPCRequest( UUID, params ) )
    , onRPCSuccess: ( UUID, data ) =>
      store.dispatch( RPC.submitRPCSuccess( UUID, data ) )
    , onRPCFailure: ( UUID, error ) =>
      store.dispatch( RPC.submitRPCFailure( UUID, error ) )
    , onRPCTimeout: ( UUID, error ) =>
      store.dispatch( RPC.submitRPCTimeout( UUID, error ) )

    // GENERIC EVENTS
    , onSystemEvent: ( data, timestamp ) =>
      store.dispatch( EVENTS.systemEvent( data, timestamp ) )

    // TASK UPDATE HANDLERS
    , onTaskCreated: ( data ) =>
      store.dispatch( TASKS.taskCreated( data ) )
    , onTaskUpdated: ( data ) =>
      store.dispatch( TASKS.taskUpdated( data ) )
    , onTaskProgress: ( data ) =>
      store.dispatch( TASKS.taskProgress( data ) )
    , onTaskFinished: ( data ) =>
      store.dispatch( TASKS.taskFinished( data ) )
    , onTaskFailed: ( data ) =>
      store.dispatch( TASKS.taskFailed( data ) )

    // STATD PULSE HANDLERS
    , onStatdPulse: ( source, pulse ) =>
      store.dispatch( STATD.pulse( source, pulse ) )

    // ENTITY-SUBSCRIBER HANDLERS
    , onEntityChanged: ( mask, data ) =>
      store.dispatch( SUBSCRIPTIONS.entityChanged( mask, data ) )
    }
  );

  ReactDOM.render(
    <Provider store={ store }>
      <Router history={ history } routes={ routes } />
    </Provider>
    , document
  );

  // SUBSCRIPTIONS TO CORE DATA
  // ==========================
  store.dispatch( SUBSCRIPTIONS.add( CORE_SUBSCRIPTIONS, "WEBAPP" ) );

  // Connecting the middleware client must be the last action taken. Because of
  // the way it mutates the global state, we need to ensure that the app is
  // rendered at least once with initial (isomorphic) values before any changes.
  store.dispatch( WEBSOCKET.changeSockTarget({ protocol, host, path, mode }) );
  MiddlewareClient.connect( protocol, host, path, mode );


  // STORAGE DATA FETCH
  // ==================
  // Volumes are always subscribed to by the webapp. This creates apparent
  // performance increases and allows easier cross-cutting logic involving
  // volume data.

  store.dispatch( SUBSCRIPTIONS.add( STORAGE_SUBSCRIPTIONS, "WEBAPP" ) );
  store.dispatch( DISKS.requestDiskOverview() );
  store.dispatch( VOLUMES.fetchVolumes() );
  store.dispatch( VOLUMES.fetchAvailableDisks() );
  store.dispatch( SHARES.fetchShares() );
}
