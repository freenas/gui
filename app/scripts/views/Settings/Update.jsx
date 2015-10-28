// Update
// ======
// Handles FreeNAS updates and Boot Environment management.

"use strict";

import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Button
       , Input
       , ListGroup
       , ListGroupItem
       , Panel
       , ProgressBar
       } from "react-bootstrap";

import * as systemActions from "../../actions/system";
import * as updateActions from "../../actions/update";

// TODO: Connection with calendar tasks to schedule update check
// TODO: Manual update
class Update extends React.Component{
  constructor( props ) {
    super( props );
  }

  componentDidMount () {
    this.props.fetchData();
    this.props.updateConfigRequest();
    this.props.isUpdateAvailableRequest();
    this.props.updateInfoRequest();
  }

  render () {

    const currentVersion = (
      <span>
        { "Installed Version: "
        + this.props.version
        + " on update train "
        + this.props.current_train
        }
      </span>
    );

    const updateServer = (
      <span>
        { "Update Server: " + this.props.update_server }
      </span>
    );

    var updateTrainChoices = null;

    if ( _.isArray ( this.props.trains ) ) {
      updateTrainChoices =
        this.props.trains.map( function createUpdateTrainChoices ( train ) {
                               return (
                                 <option
                                   key = { train.name }
                                   value = { train.name }
                                 >
                                   { train.name }
                                 </option>
                               );
                               }
                             );
    } else {
      updateTrainChoices = [
        (<option
          key = { this.props.current_train }
          value = { this.props.current_train }
        >
          { this.props.current_train }
        </option>
        )
      ];
    }

    const updateTrain = (
      <Input
        type = "select"
        label = "Update Train"
        value = { this.props.targetTrain || this.props.train }
        onChange = { ( e ) => this.props.updateUpdateSettings( "train"
                                                             , e.target.value
                                                             )
                   }
      >
        { updateTrainChoices }
      </Input>
    );

    const checkForUpdatesButton = (
      <Button
        bsStyle = "default"
        onClick = { this.props.checkTaskRequest }
      >
        { "Check for Updates" }
      </Button>
    );

    const downloadUpdateButton = (
      <Button
        bsStyle = "info"
        onClick = { this.props.downloadUpdateTaskRequest }
        disabled = { !this.props.updateAvailable || this.props.downloaded }
      >
        { "Download Update" }
      </Button>
    );

    // Alternate TODO: Have it check for update, download update, and apply
    // update if necessary.
    const updateNowButton = (
      <Button
        bsStyle = "success"
        onClick = { this.props.updateTaskRequest }
        disabled = { !this.props.downloaded }
      >
        { "Update Now" }
      </Button>
    );

    var availableUpdatePanel = (
      <Panel>
        { "No Update Available." }
      </Panel>
    );

    if ( this.props.changelog.length > 1 ) {
      let changelog = (
        <div>
          { "Pending Changes:"}
          <ListGroup>
            { this.props.changelog.map( function makeChangelogList ( item
                                                                   , index
                                                                   ) {
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

    var downloadProgressBar = null;

    if ( this.props.downloadPercentage ) {
      downloadProgressBar = (
        <ProgressBar now = { this.props.downloadPercentage }/>
      );
    }

    var upgradeProgressBar = null;

    if ( this.props.updatePercentage ) {
      upgradeProgressBar = (
        <ProgressBar now = { this.props.updatePercentage }/>
      );
    }

    return (
      <div>
        <h2>{ "Update FreeNAS" }</h2>
        { currentVersion }
        <br/>
        { updateServer }
        <br/>
        { updateTrain }
        { availableUpdatePanel }
        { checkForUpdatesButton }
        { downloadUpdateButton }
        { downloadProgressBar }
        { updateNowButton }
        { upgradeProgressBar }
      </div>
    );
    return null;
  }
};

Update.propTypes =
  { version: React.PropTypes.string
  // , check_auto: React.PropTypes.bool
  , update_server: React.PropTypes.string
  , train: React.PropTypes.string
  , targetTrain: React.PropTypes.string
  , current_train: React.PropTypes.string
  , updateAvailable: React.PropTypes.bool
  , changelog: React.PropTypes.arrayOf( React.PropTypes.string )
  , notes: React.PropTypes.string
  , operations: React.PropTypes.shape(
                  { new_name: React.PropTypes.string
                  , new_version: React.PropTypes.string
                  , previous_name: React.PropTypes.string
                  , previous_version: React.PropTypes.string
                  , operation: React.PropTypes.oneOf( [ "delete"
                                                      , "install"
                                                      , "upgrade"
                                                      ]
                                                    )
                  }
                )
  , downloaded: React.PropTypes.bool
  , trains: React.PropTypes.arrayOf(
              React.PropTypes.shape(
                { current: React.PropTypes.bool
                , sequence: React.PropTypes.string
                , name: React.PropTypes.string
                , description: React.PropTypes.string
                }
              )
            )
  , downloadPercentage: React.PropTypes.number
  , updatePercentage: React.PropTypes.number
  , updateConfigSettings: React.PropTypes.object
  , updateUpdateSettings: React.PropTypes.func.isRequired
  , resetUpdateSettings: React.PropTypes.func.isRequired
  , fetchData: React.PropTypes.func.isRequired
  , updateConfigRequest: React.PropTypes.func.isRequired
  , isUpdateAvailableRequest: React.PropTypes.func.isRequired
  , updateInfoRequest: React.PropTypes.func.isRequired
  , checkTaskRequest: React.PropTypes.func.isRequired
  , checkFetchTaskRequest: React.PropTypes.func.isRequired
  , updateConfigTaskRequest: React.PropTypes.func.isRequired
  , downloadUpdateTaskRequest: React.PropTypes.func.isRequired
//  , manualUpdateTaskRequest: React.PropTypes.func.isRequired
  , updateTaskRequest: React.PropTypes.func.isRequired
  , verifyTaskRequest: React.PropTypes.func.isRequired
  };

// REDUX
function mapStateToProps ( state ) {
  return ( { version: state.system.info.version
           , check_auto: state.update.check_auto
           , update_server: state.update.update_server
           , train: state.update.train
           , targetTrain: state.update.targetTrain
           , current_train: state.update.current_train
           , updateAvailable: state.update.updateAvailable
           , changelog: state.update.changelog
           , notes: state.update.notes
           , operations: state.update.operations
           , downloaded: state.update.downloaded
           , trains: state.update.trains
           , downloadPercentage: state.update.downloadPercentage
           , updatePercentage: state.update.updatePercentage
           , updateConfigSettings: state.update.updateConfigSettings
           }
         );
};

function mapDispatchToProps ( dispatch ) {
  return (
    // OS FORM
    { updateUpdateSettings: ( field, value ) =>
        dispatch( updateActions.updateUpdateSettings( field, value ) )
    , resetUpdateSettings: () =>
        dispatch( systemActions.resetUpdateSettings() )

    // QUERIES
    , fetchData: () => {
      // One-Time Queries
      dispatch( systemActions.requestVersion() );
      dispatch( updateActions.updateTrainsRequest() );
      dispatch( updateActions.currentTrainRequest() );
    }
    , updateConfigRequest: () =>
        dispatch( updateActions.updateConfigRequest() )
    , isUpdateAvailableRequest: () =>
        dispatch( updateActions.isUpdateAvailableRequest() )
    , updateInfoRequest: () => dispatch( updateActions.updateInfoRequest() )

    // TASKS
    , checkTaskRequest: () => dispatch( updateActions.checkTaskRequest() )
    , checkFetchTaskRequest: () =>
        dispatch( updateActions.checkFetchTaskRequest() )
    , updateConfigTaskRequest: () =>
        dispatch( updateActions.updateConfigTaskRequest() )
    , downloadUpdateTaskRequest: () =>
        dispatch( updateActions.downloadUpdateTaskRequest() )
    // , manualUpdateTaskRequest: () => dispatch( updateActions.manualUpdate() )
    , updateTaskRequest: () => dispatch( updateActions.updateTaskRequest() )
    , verifyTaskRequest: () => dispatch( updateActions.verifyTaskRequest() )
    }
  );
};

export default connect( mapStateToProps, mapDispatchToProps )( Update );
