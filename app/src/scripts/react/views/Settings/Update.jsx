// Update
// ======
// Handles FreeNAS updates and Boot Environment management.

"use strict";

import React from "react";
import { Button
       , Input
       , ListGroup
       , ListGroupItem
       , Panel
       } from "react-bootstrap";

import SM from "../../../flux/middleware/SystemMiddleware";
import SS from "../../../flux/stores/SystemStore";

import UM from "../../../flux/middleware/UpdateMiddleware";
import US from "../../../flux/stores/UpdateStore";

const Update = React.createClass(
  { getInitialState () {
    return { boot_scrub_internal: null // from system.advanced
           // from update.get_config:
           , check_auto: false
           , update_server: "" // read-only
           , train: "" // regarding a particular update.
           // Is it possible for more than one updates to be queued?
           // from update.get_current_train:
           , current_train: ""
           // from update.is_update_available:
           , updateAvailable: false // contradicts the schema?
           // from update.update_info:
           , changelog: [] // Array of strings
           , notes: "" // Human-readable notes, usually links to a README or such
           , operations: [] // Changes that will be made. Pretty much just a package list
           // from update.trains:
           , trains: []
           };
  }

  , componentDidMount () {
    SM.subscribe( this.constructor.displayName);
    SS.addChangeListener( this.handleChanges );

    UM.subscribe( this.constructor.displayName );
    US.addChangeListener( this.handleChanges );

    SM.requestSystemAdvancedConfig();
    UM.getUpdateConfig();
    UM.getCurrentTrain();
    UM.getUpdateInfo();
    UM.isUpdateAvailable();
    UM.getUpdateTrains();
  }

  , componentWillUnmount () {
    SM.unsubscribe( this.constructor.displayName );
    SS.removeChangeListener( this.handleChanges );

    UM.unsubscribe( this.constructor.displayName );
    US.removeChangeListener( this.handleChanges );
  }

  , handleChanges ( eventMask ) {
    switch ( eventMask ) {
      case "updateConfig":
        this.setState( US.updateConfig );
        break;

      case "currentTrain":
        this.setState( { current_train: US.currentTrain } );
        break;

      case "updateInfo":
        this.setState( US.updateInfo );
        if ( !_.isEmpty( US.updateInfo ) && !this.state.updateAvailable ) {
          UM.isUpdateAvailable();
        }
        break;

      case "updateAvailable":
        this.setState( { updateAvailable: US.updateAvailable } );
        break;

      case "trains":
        this.setState( { trains: US.trains } );
        break;

      // These cases are for showing task processing, eg with spinners or
      // progress bars
      case "configureUpdateTask":
        break;

      case "updateNowTask":
        break;

      case "downloadUpdateTask":
        break;

      case "manualUpdateTask":
        break;

      case "verifyInstallTask":
        break;

      case "updateCheckFinished":
        UM.getUpdateInfo();
        break;
    }
  }

  , acceptChange ( tag, evt ) {
    switch ( tag ) {
      case "train":
        this.setState( { current_train: evt.target.value } );
        break;
    }
  }

  // TODO: Connection with tasks to schedule update check
  , render () {

    const updateServer = (
      <span>
        { "Update Server: " + this.state.update_server }
      </span>
    );

    const updateTrain = (
      <span>
        { "Update Train: " + this.state.current_train }
      </span>
    );

    const checkForUpdatesButton = (
      <Button
        bsStyle = "default"
        onClick = { UM.checkForUpdate }
      >
        { "Check for Updates" }
      </Button>
    );

    const updateNowButton = (
      <Button
        bsStyle = "success"
        onClick = { UM.updateNow }
        disabled = { !US.updateAvailable }
      >
        { "Update Now" }
      </Button>
    );

    var availableUpdatePanel = (
      <Panel>
        { "No Update Available." }
      </Panel>
    );

    if ( US.updateAvailable ) {
      let changelog = (
        <div>
          { "Pending Changes:"}
          <ListGroup>
            { US.updateInfo.changelog.map( function makeChangelogList ( item, index ) {
                return (
                  <ListGroupItem key = { index }>
                    { item }
                   </ListGroupItem>
                );
              } )
            }
          </ListGroup>
        </div>
      );
      availableUpdatePanel = (
        <Panel>
          { changelog }
        </Panel>
      );
    }

    return (
      <div>
        <h2>Update FreeNAS</h2>
          { updateServer }
          <br/>
          { updateTrain }
          { availableUpdatePanel }
          { checkForUpdatesButton }
          { updateNowButton }
        </div>
    );
  }
});

export default Update;
