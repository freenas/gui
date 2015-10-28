// UPDATES REDUCER
// ===============

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  // from update.get_config:
  { check_auto: false
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
  , operations: {} // Changes that will be made. Pretty much just a package list
  , downloaded: false // The update in question is downloaded and ready to install
  // from update.trains:
  , trains: []
  // from an ongoing download task
  , downloadPercentage: 0
  // from an ongoing update task
  , updatePercentage: 0
  , updateConfigSettings: {}
  , updateTrainsRequests: new Set()
  , currentTrainRequests: new Set()
  , updateConfigRequests: new Set()
  , isUpdateAvailableRequests: new Set()
  , updateInfoRequests: new Set()
  };

export default function updates ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  switch ( type ) {
    // SETTINGS
    case TYPES.UPDATE_UPDATE_SETTINGS:
      return Object.assign( {}
                          , state
                          , { [ payload.field ]: payload.value }
                          )
      return state;
    case TYPES.RESET_UPDATE_SETTINGS:
      return state;

    // QUERIES
    case TYPES.UPDATE_TRAINS_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "updateTrainsRequests"
                                      )
                          );
    case TYPES.CURRENT_TRAIN_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "currentTrainRequests"
                                      )
                          );
    case TYPES.UPDATE_CONFIG_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "updateConfigRequests"
                                      )
                          );
    case TYPES.IS_UPDATE_AVAILABLE_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "isUpdateAvailableRequests"
                                      )
                          );
    case TYPES.UPDATE_INFO_REQUEST:
      return Object.assign( {}
                          , state
                          , recordUUID( payload.UUID
                                      , state
                                      , "updateInfoRequests"
                                      )
                          );

    // RPC REQUEST HANDLING
    case TYPES.RPC_SUCCESS:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_TIMEOUT:
      if ( state.updateTrainsRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , { trains: payload.data }
                              , resolveUUID( payload.UUID
                                           , state
                                           , "updateTrainsRequests"
                                           )
                              );
        }
      } else if ( state.currentTrainRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , { current_train: payload.data }
                              , resolveUUID( payload.UUID
                                           , state
                                           , "currentTrainRequests"
                                           )
                              );
        }
      } else if ( state.updateConfigRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID
                                           , state
                                           , "updateConfigRequests"
                                           )
                              , payload.data
                              );
        }
      } else if ( state.isUpdateAvailableRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , { updateAvailable: payload.data }
                              , resolveUUID( payload.UUID
                                           , state
                                           , "isUpdateAvailableRequests"
                                           )
                              );
        }
      } else if ( state.updateInfoRequests.has( payload.UUID ) ) {
        if ( payload.data ) {
          return Object.assign( {}
                              , state
                              , resolveUUID( payload.UUID
                                           , state
                                           , "updateInfoRequests"
                                           )
                              , payload.data
                              );
        }
      } else {
        return state;
      }

    // TASK HANDLING
    case TYPES.TASK_CREATED:
      return state;
    case TYPES.TASK_UPDATED:
      return state;
    case TYPES.TASK_PROGRESS:
      return state;
    case TYPES.TASK_FINISHED:
      return state;
    case TYPES.TASK_FAILED:
      return state;

    default:
      return state;
  }
};
