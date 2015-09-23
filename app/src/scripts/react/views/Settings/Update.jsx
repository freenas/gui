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
    return { version: "" // from system.info.version
           // from update.get_config:
           , check_auto: false
           , update_server: "" // read-only
           , train: "" // the server-side target train
           , targetTrain: "" // The target train being configured
           // from update.get_current_train
           // This is the train that the current OS is from
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

    SM.requestVersion();
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
        let newUpdateState = _.cloneDeep( US.updateConfig );
        newUpdateState.targetTrain = "";
        this.setState( newUpdateState );
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

      case "version":
        this.setState( { version: SS.version } );

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
        // TODO: Make this more forgiving by using the upcoming version of
        // the update info queries that takes a train name
        this.setState( { targetTrain: evt.target.value } );
        UM.configureUpdates( { train: evt.target.value } );
        break;
    }
  }

  // TODO: Connection with tasks to schedule update check
  , render () {

    const currentVersion = (
      <span>
        { "Installed Version: "
        + this.state.version
        + " on update train "
        + this.state.current_train
        }
      </span>
    );

    const updateServer = (
      <span>
        { "Update Server: " + this.state.update_server }
      </span>
    );

    var updateTrainChoices =
      this.state.trains.map( function createUpdateTrainChoices ( train ) {
                             return (
                               <option
                                 key = { train.name }
                                 value = { train.name }
                                 label = { train.name }
                               />
                             );
                             }
                           );

    // Not yet functional; waiting for middleware issue to be resolved
    const updateTrain = (
      <Input
        type = "select"
        label = "Update Train"
        value = { this.state.targetTrain || this.state.train }
        onChange = { this.acceptChange.bind( null, "train" ) }
      >
        { updateTrainChoices }
      </Input>
    );

    const checkForUpdatesButton = (
      <Button
        bsStyle = "default"
        onClick = { UM.checkForUpdate }
      >
        { "Check for Updates" }
      </Button>
    );

    // TODO: Only enable when there's an update available but not staged.
    const downloadUpdateButton = (
      <Button
        bsStyle = "info"
        onClick = { UM.downloadUpdate }
        disabled = { !this.state.updateAvailable }
      >
        { "Download Update" }
      </Button>
    );

    // TODO: Only enabled when there's an update downloaded but not installed
    // Alternate TODO: Have it check for update, download update, and apply
    // update if necessary.
    const updateNowButton = (
      <Button
        bsStyle = "success"
        onClick = { UM.updateNow }
        disabled = { !this.state.updateAvailable }
      >
        { "Update Now" }
      </Button>
    );

    var availableUpdatePanel = (
      <Panel>
        { "No Update Available." }
      </Panel>
    );

    if ( this.state.changelog.length > 1 ) {
      let changelog = (
        <div>
          { "Pending Changes:"}
          <ListGroup>
            { this.state.changelog.map( function makeChangelogList ( item, index ) {
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
        { currentVersion }
        <br/>
        { updateServer }
        <br/>
        { updateTrain }
        { availableUpdatePanel }
        { checkForUpdatesButton }
        { downloadUpdateButton }
        { updateNowButton }
      </div>
    );
  }
});

export default Update;
