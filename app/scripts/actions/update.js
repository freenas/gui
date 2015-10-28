// UPDATE ACTION CREATORS
// ======================

"use strict";

import { UPDATE_UPDATE_SETTINGS
       , RESET_UPDATE_SETTINGS
       , UPDATE_CONFIG_REQUEST
       , CURRENT_TRAIN_REQUEST
       , IS_UPDATE_AVAILABLE_REQUEST
       , UPDATE_TRAINS_REQUEST
       , UPDATE_INFO_REQUEST
       , CHECK_TASK_REQUEST
       , CHECK_FETCH_TASK_REQUEST
       , UPDATE_CONFIG_TASK_REQUEST
       , DOWNLOAD_UPDATE_TASK_REQUEST
       , MANUAL_UPDATE_TASK_REQUEST
       , UPDATE_TASK_REQUEST
       , VERIFY_TASK_REQUEST
       }
  from "./actionTypes";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// SETTINGS
export function updateUpdateSettings ( field, value ) {
  return (
    { type: UPDATE_UPDATE_SETTINGS
    , payload:
      { field: field
      , value: value
      }
    }
  );
};

export function resetUpdateSettings () {
  return { type: RESET_UPDATE_SETTINGS };
};

// QUERIES
export function updateTrainsRequest () {
  return ( dispatch ) => {
    MC.request( "update.trains"
              , []
              , ( UUID ) =>
                  dispatch( watchRequest( UUID, UPDATE_TRAINS_REQUEST ) )
              );
  };
};

export function currentTrainRequest () {
  return ( dispatch ) => {
    MC.request( "update.get_current_train"
              , []
              , ( UUID ) =>
                  dispatch( watchRequest( UUID, CURRENT_TRAIN_REQUEST ) )
              );
  };
};


export function updateConfigRequest () {
  return ( dispatch ) => {
    MC.request( "update.get_config"
              , []
              , ( UUID ) =>
                  dispatch( watchRequest( UUID, UPDATE_CONFIG_REQUEST ) )
              );
  };
};

export function isUpdateAvailableRequest () {
  return ( dispatch ) => {
    MC.request( "update.is_update_available"
              , []
              , ( UUID ) =>
                  dispatch( watchRequest( UUID, IS_UPDATE_AVAILABLE_REQUEST ) )
              );
  };
};

export function updateInfoRequest () {
  return ( dispatch ) => {
    MC.request( "update.update_info"
              , []
              , ( UUID ) =>
                  dispatch( watchRequest( UUID, UPDATE_INFO_REQUEST ) )
              );
  };
};

// TASKS
export function checkTaskRequest () {
  return ( dispatch ) => {
    MC.submitTask( [ "update.check", [] ] // TODO: Check if other params matter
                 , ( UUID ) => dispatch( watchRequest, CHECK_TASK_REQUEST )
                 );
  };
};

export function checkFetchTaskRequest () {
  return ( dispatch ) => {
    MC.submitTask( [ "update.checkfetch", [] ]
                 , ( UUID ) =>
                     dispatch( watchRequest, CHECK_FETCH_TASK_REQUEST )
                 );
  };
};

export function updateConfigTaskRequest () {
  return ( dispatch, getState ) => {
    const state = getState();
    MC.submitTask( [ "update.configure", [ state.update.updateConfigSettings ] ]
                 , ( UUID ) =>
                     dispatch( watchRequest, UPDATE_CONFIG_TASK_REQUEST )
                 );
  };
};

export function downloadUpdateTaskRequest () {
  return ( dispatch ) => {
    MC.submitTask( [ "update.download", [] ]
                 , ( UUID ) =>
                     dispatch( watchRequest, DOWNLOAD_UPDATE_TASK_REQUEST )
                 );
  };
};
/*
export function manualUpdateTaskRequest () {
  return ( dispatch, getState ) => {
    MC.submitTask( [ "update.manual", [ TODO: Way to acquire the necessary args ] ]
                 , ( UUID ) =>
                     dispatch( watchRequest, MANUAL_UPDATE_TASK_REQUEST )
                 );
  };
};
*/
export function updateTaskRequest () {
  return ( dispatch, getState ) => {
    MC.submitTask( [ "update.update", [] ] // What are we doing about update now vs update and reboot now?
                 , ( UUID ) => dispatch( watchRequest, UPDATE_TASK_REQUEST )
                 );
  };
};

export function verifyTaskRequest () {
  return ( dispatch, getState ) => {
    MC.submitTask( [ "update.verify", [] ]
                 , ( UUID ) => dispatch( watchRequest, VERIFY_TASK_REQUEST )
                 );
  };
};




