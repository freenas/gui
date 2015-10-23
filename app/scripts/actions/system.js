// SYSTEM ACTION CREATORS
// =======================

"use strict";

import * as TYPES from "./actionTypes";
import MC from "../websocket/MiddlewareClient";


// OS FORM
export function updateOSForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_OS_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetOSForm () {
  return ( { type: TYPES.RESET_OS_FORM } );
};


// CONNECTION FORM
/*
export function updateConnectionForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_CONNECTION_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetConnectionForm () {
  return ( { type: TYPES.RESET_CONNECTION_FORM } );
};
*/

// LOCALIZATION FORM
export function updateLocalizationForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_LOCALIZATION_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetLocalizationForm () {
  return ( { type: TYPES.RESET_LOCALIZATION_FORM } );
};


// CONSOLE FORM
export function updateConsoleForm ( field, value ) {
  return (
    { type: TYPES.UPDATE_CONSOLE_FORM
    , payload: { field: field
               , value: value
               }
    }
  );
};

export function resetConsoleForm () {
  return ( { type: TYPES.RESET_CONSOLE_FORM } );
};

export function resetConsoleForm () {
  return ( { type: TYPES.RESET_CONSOLE_FORM } );
};


// GENERAL QUERIES
function generalConfigRequest ( UUID ) {
  return { type: TYPES.SYSTEM_GENERAL_CONFIG_REQUEST
         , payload: { UUID }
         };
};

export function requestGeneralConfig () {
  return ( dispatch, getState ) => {
    MC.request( "system.general.get_config"
              , []
              , ( UUID ) => dispatch( generalConfigRequest( UUID ) )
              );
  };
};

function timezonesRequest ( UUID ) {
  return { type: TYPES.SYSTEM_GENERAL_TIMEZONES_REQUEST
         , payload: { UUID }
         };
};

export function requestTimezones () {
  return ( dispatch, getState ) => {
    MC.request( "system.general.timezones"
              , []
              , ( UUID ) => dispatch( timezonesRequest( UUID ) )
              );
  };
};

function keymapsRequest ( UUID ) {
  return { type: TYPES.KEYMAPS_REQUEST
         , payload: { UUID }
         };
};

export function requestKeymaps () {
  return ( dispatch, getState ) => {
    MC.request( "system.general.keymaps"
              , []
              , ( UUID ) => dispatch( keymapsRequest( UUID ) )
              );
  };
};


// ADVANCED QUERIES
function advancedConfigRequest ( UUID ) {
  return { type: TYPES.SYSTEM_ADVANCED_CONFIG_REQUEST
         , payload: { UUID }
         };
};

export function requestAdvancedConfig () {
  return ( dispatch, getState ) => {
    MC.request( "system.advanced.get_config"
              , []
              , ( UUID ) => dispatch( advancedConfigRequest( UUID ) )
              );
  };
};

function serialPortsRequest ( UUID ) {
  return { type: TYPES.SERIAL_PORTS_REQUEST
         , payload: { UUID }
         }
};

export function requestSerialPorts () {
  return ( dispatch, getState ) => {
    MC.request( "system.advanced.serial_ports"
              , []
              , ( UUID ) => dispatch( serialPortsRequest( UUID ) )
              );
  };
};


// INFO QUERIES
function systemInfoHardwareRequest ( UUID ) {
  return { type: TYPES.SYSTEM_INFO_HARDWARE_REQUEST
         , payload: { UUID }
         };
};

export function requestHardware () {
  return ( dispatch, getState ) => {
    MC.request( "system.info.hardware"
              , []
              , ( UUID ) => dispatch( systemInfoHardwareRequest( UUID ) )
              );
  }
};

function systemInfoLoadAvgRequest ( UUID ) {
  return { type: TYPES.SYSTEM_INFO_LOAD_AVG_REQUEST
         , payload: { UUID }
         };
};

export function requestLoadAvg () {
  return ( dispatch, getState ) => {
    MC.request( "system.info.load_avg"
              , []
              , ( UUID ) => dispatch( systemInfoLoadAvgRequest( UUID ) )
              );
  };
};

function systemInfoTimeRequest ( UUID ) {
  return { type: TYPES.SYSTEM_INFO_TIME_REQUEST
         , payload: { UUID }
         };
};

export function requestTime () {
  return ( dispatch, getState ) => {
    MC.request( "system.info.time"
              , []
              , ( UUID ) => dispatch( systemInfoTimeRequest( UUID ) )
              );
  };
};

function systemInfoUnameFullRequest ( UUID ) {
  return { type: TYPES.SYSTEM_INFO_UNAME_FULL_REQUEST
         , payload: { UUID }
         };
};

export function requestUnameFull () {
  return ( dispatch, getState ) => {
    MC.request( "system.info.uname_full"
              , []
              , ( UUID ) => dispatch( systemInfoUnameFullRequest( UUID ) )
              );
  };
};

function systemInfoVersionRequest ( UUID ) {
  return { type: TYPES.SYSTEM_INFO_VERSION_REQUEST
         , payload: { UUID }
         };
};

export function requestVersion () {
  return ( dispatch, getState ) => {
    MC.request( "system.info.version"
              , []
              , ( UUID ) => dispatch( systemInfoVersionRequest( UUID ) )
              );
  };
};
