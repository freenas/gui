// SYSTEM ACTION CREATORS
// =======================

"use strict";

import { UPDATE_OS_FORM
       , RESET_OS_FORM
       , UPDATE_CONNECTION_FORM
       , RESET_CONNECTION_FORM
       , UPDATE_LOCALIZATION_FORM
       , RESET_LOCALIZATION_FORM
       , UPDATE_CONSOLE_FORM
       , RESET_CONSOLE_FORM
       , SYSTEM_GENERAL_CONFIG_REQUEST
       , SYSTEM_GENERAL_TIMEZONES_REQUEST
       , KEYMAPS_REQUEST
       , SYSTEM_ADVANCED_CONFIG_REQUEST
       , SERIAL_PORTS_REQUEST
       , SYSTEM_INFO_HARDWARE_REQUEST
       , SYSTEM_INFO_LOAD_AVG_REQUEST
       , SYSTEM_INFO_TIME_REQUEST
       , SYSTEM_INFO_UNAME_FULL_REQUEST
       , SYSTEM_INFO_VERSION_REQUEST
       , SUBMIT_OS_TASK_REQUEST
       , SUBMIT_LOCALIZATION_TASK_REQUEST
       , SUBMIT_CONSOLE_TASK_REQUEST
       , SUBMIT_REBOOT_TASK_REQUEST
       , SUBMIT_SHUTDOWN_TASK_REQUEST
       }
  from "./actionTypes";

import { watchRequest } from "../utility/Action";
import MC from "../websocket/MiddlewareClient";


// OS FORM
export function updateOSForm ( field, value ) {
  return (
    { type: UPDATE_OS_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetOSForm () {
  return ( { type: RESET_OS_FORM } );
};


// CONNECTION FORM
/*
export function updateConnectionForm ( field, value ) {
  return (
    { type: UPDATE_CONNECTION_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetConnectionForm () {
  return ( { type: RESET_CONNECTION_FORM } );
};
*/

// LOCALIZATION FORM
export function updateLocalizationForm ( field, value ) {
  return (
    { type: UPDATE_LOCALIZATION_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetLocalizationForm () {
  return ( { type: RESET_LOCALIZATION_FORM } );
};


// CONSOLE FORM
export function updateConsoleForm ( field, value ) {
  return (
    { type: UPDATE_CONSOLE_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetConsoleForm () {
  return ( { type: RESET_CONSOLE_FORM } );
};

// GENERAL QUERIES

export function requestGeneralConfig () {
  return ( dispatch ) => {
    MC.request( "system.general.get_config"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_GENERAL_CONFIG_REQUEST ) )
              );
  };
};

export function requestTimezones () {
  return ( dispatch ) => {
    MC.request( "system.general.timezones"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_GENERAL_TIMEZONES_REQUEST ) )
              );
  };
};

export function requestKeymaps () {
  return ( dispatch ) => {
    MC.request( "system.general.keymaps"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, KEYMAPS_REQUEST ) )
              );
  };
};


// ADVANCED QUERIES

export function requestAdvancedConfig () {
  return ( dispatch ) => {
    MC.request( "system.advanced.get_config"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_ADVANCED_CONFIG_REQUEST ) )
              );
  };
};

export function requestSerialPorts () {
  return ( dispatch ) => {
    MC.request( "system.advanced.serial_ports"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SERIAL_PORTS_REQUEST ) )
              );
  };
};


// INFO QUERIES

export function requestHardware () {
  return ( dispatch ) => {
    MC.request( "system.info.hardware"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_INFO_HARDWARE_REQUEST ) )
              );
  }
};

export function requestLoadAvg () {
  return ( dispatch ) => {
    MC.request( "system.info.load_avg"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_INFO_LOAD_AVG_REQUEST ) )
              );
  };
};

export function requestTime () {
  return ( dispatch ) => {
    MC.request( "system.info.time"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_INFO_TIME_REQUEST ) )
              );
  };
};

export function requestUnameFull () {
  return ( dispatch ) => {
    MC.request( "system.info.uname_full"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_INFO_UNAME_FULL_REQUEST ) )
              );
  };
};

export function requestVersion () {
  return ( dispatch ) => {
    MC.request( "system.info.version"
              , []
              , ( UUID ) =>
                dispatch( watchRequest( UUID, SYSTEM_INFO_VERSION_REQUEST ) )
              );
  };
};

// TASKS
// These tasks are different from some other views, because there is not a 1:1
// relationship between a form an a single task submission or query source.
// Therefore, these are organized by form, not task.

export function submitOSTask () {
  return ( dispatch, getState ) => {
    const state = getState();

    MC.request( "task.submit"
              , [ "system.advanced.configure", [ state.system.osForm ] ]
              , UUID => dispatch( watchRequest( UUID, SUBMIT_OS_TASK_REQUEST ) )
              );
  };
};

export function submitLocalizationTask () {
  return ( dispatch, getState ) => {
    const state = getState();

    MC.request( "task.submit"
              , [ "system.general.configure", [ state.system.localizationForm ] ]
              , UUID => dispatch( watchRequest( UUID, SUBMIT_LOCALIZATION_TASK_REQUEST ) )
              );
  };
};

export function submitConsoleTask () {
  return ( dispatch, getState ) => {
    const state = getState();

    MC.request( "task.submit"
              , [ "system.advanced.configure", [ state.system.consoleForm ] ]
              , UUID => dispatch( watchRequest( UUID, SUBMIT_CONSOLE_TASK_REQUEST ) )
              );
  };
};

export function rebootTask () {
  return ( dispatch ) => {

    MC.request( "task.submit"
              , [ "system.reboot", [] ]
              , UUID => dispatch( watchRequest( UUID, SUBMIT_REBOOT_TASK_REQUEST ) )
              );
  };
};

export function shutdownTask () {
  return ( dispatch ) => {

    MC.request( "task.submit"
              , [ "system.shutdown", [] ]
              , UUID => dispatch( watchRequest( UUID, SUBMIT_SHUTDOWN_TASK_REQUEST ) )
              );
  };
};

