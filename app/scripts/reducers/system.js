// SYSTEM REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";
import { recordUUID, resolveUUID } from "../utility/Reducer";

const INITIAL_STATE =
  { general:
    { timezone: ""
    , hostname: ""
    , syslog_server: ""
    , language: ""
    , console_keymap: ""
    , keymaps: []
    , timezones: []
    }
  , advanced:
    { boot_scrub_internal: null
    , motd: ""
    , serial_console: false
    , serial_port: ""
    , uploadcrash: false
    , console_screensaver: false
    , swapondrive: null
    , debugkernel: false
    , serial_speed: null
    , powerd: false
    , console_cli: false
    , autotune: false
    , periodic_notify_user: null
    , serial_ports: []
    }
  // , ui: {}
  , info:
    { hardware:
      { memory_size: 0
      , cpu_model: ""
      , cpu_cores: 1
      }
      , load_avg: [ 0, 0, 0 ]
      , time:
        { timezone: ""
        , system_time: ""
        , boot_time: ""
        , uptime: ""
        }
      , uname_full: ""
      , version: ""
    }
  // , connectionForm: {}
  , osForm: {}
  , localizationForm: {}
  , consoleForm: {}
  , generalConfigRequests: new Set()
  , timezonesRequests: new Set()
  , keymapsRequests: new Set()
  , advancedConfigRequests: new Set()
  , serialPortsRequests: new Set()
  , hardwareRequests: new Set()
  , loadAvgRequests: new Set()
  , timeRequests: new Set()
  , unameFullRequests: new Set()
  , versionRequests: new Set()
  , generalConfigTasks: new Set()
  , advancedConfigTasks: new Set()
  , rebootTasks: new Set()
  , shutdownTasks: new Set()
  };

export default function system ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

  var general, advanced, info;

  var generalConfigRequests;
  var timezonesRequests;
  var keymapsRequests;
  var advancedConfigRequests;
  var serialPortsRequests;
  var hardwareRequests;
  var loadAvgRequests;
  var timeRequests;
  var unameFullRequests;
  var versionRequests;

  switch ( type ) {
    // OS FORM
    case TYPES.UPDATE_OS_FORM:
      var changes = { osForm: Object.assign( {}, state.osForm ) };
      changes.osForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, changes );
    case TYPES.RESET_OS_FORM:
      return Object.assign( {}, state, { osForm: {} } );
    // case TYPES.SUBMIT_OS_FORM:
    //  return state;

    // CONNECTION FORM
    /*case TYPES.UPDATE_CONNECTION_FORM:
      var changes = { connectionForm: Object.assign( {}
                                                   , state.connectionForm
                                                   )
                    };
      changes.connectionForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, changes );
    case TYPES.RESET_CONNECTION_FORM:
      return Object.assign( {}, state, { connectionForm: {} } );
    // case TYPES.SUBMIT_CONNECTION_FORM:
    //  return state;
    */
    // LOCALIZATION FORM
    case TYPES.UPDATE_LOCALIZATION_FORM:
      var changes = { localizationForm: Object.assign( {}
                                                     , state.localizationForm
                                                     )
                    };
      changes.localizationForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, changes );
    case TYPES.RESET_LOCALIZATION_FORM:
      return Object.assign( {}, state, { localizationForm: {} } );
    // case TYPES.SUBMIT_LOCALIZATION_FORM:
    //  return state;

    // CONSOLE FORM
    case TYPES.UPDATE_CONSOLE_FORM:
      var changes = { consoleForm: Object.assign( {}, state.consoleForm ) };
      changes.consoleForm[ payload.field ] = payload.value;
      return Object.assign( {}, state, changes );
    case TYPES.RESET_CONSOLE_FORM:
      return Object.assign( {}, state, { consoleForm: {} } );
    // case TYPES.SUBMIT_CONSOLE_FORM:
    //  return state;

    // GENERAL QUERIES
    case TYPES.SYSTEM_GENERAL_CONFIG_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "generalConfigRequests" )
      );
    case TYPES.SYSTEM_GENERAL_TIMEZONES_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "timezonesRequests" )
      );
    case TYPES.KEYMAPS_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "keymapsRequests" )
      );

    // ADVANCED QUERIES
    case TYPES.SYSTEM_ADVANCED_CONFIG_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "advancedConfigRequests" )
      );
    case TYPES.SERIAL_PORTS_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "serialPortsRequests" )
      );

    // INFO QUERIES
    case TYPES.SYSTEM_INFO_HARDWARE_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "hardwareRequests" )
      );
    case TYPES.SYSTEM_INFO_LOAD_AVG_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "loadAvgRequests" )
      );
    case TYPES.SYSTEM_INFO_TIME_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "timeRequests" )
      );
    case TYPES.SYSTEM_INFO_UNAME_FULL_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "unameFullRequests" )
      );
    case TYPES.SYSTEM_INFO_VERSION_REQUEST:
      return Object.assign( {}, state,
        recordUUID( payload.UUID, state, "versionRequests" )
      );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      // GENERAL
      if ( state.generalConfigRequests.has( payload.UUID ) ) {
        general = Object.assign( {}, state.general, payload.data );
        return Object.assign( {}, state, { general }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "generalConfigRequests"
                                         )
                            );
      } else if ( state.timezonesRequests.has( payload.UUID ) ) {
        general = Object.assign( {}, state.general );
        general.timezones = payload.data;
        return Object.assign( {}, state, { general }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "timezonesRequests"
                                         )
                            );
      } else if ( state.keymapsRequests.has( payload.UUID ) ) {
        general = Object.assign( state.general );
        general.keymaps = payload.data;
        return Object.assign( {}, state, { general }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "keymapsRequests"
                                         )
                            );

      // ADVANCED
      } else if ( state.advancedConfigRequests.has( payload.UUID ) ) {
        advanced = Object.assign( {}, state.advanced, payload.data );
        return Object.assign( {}, state, { advanced }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "advancedConfigRequests"
                                         )
                            );
      } else if ( state.serialPortsRequests.has( payload.UUID ) ) {
        advanced = Object.assign( {}, state.advanced );
        advanced.serial_ports = payload.data;
        return Object.assign( {}, state, { advanced }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "serialPortsRequests"
                                         )
                            );

      // INFO
      } else if ( state.hardwareRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.hardware = payload.data;
        return Object.assign( {}, state, { info }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "hardwareRequests"
                                         )
                            );
      } else if ( state.loadAvgRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.load_avg = payload.data;
        return Object.assign( {}, state, { info }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "loadAvgRequests"
                                         )
                            );
      } else if ( state.timeRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.time = payload.data;
        return Object.assign( {}, state, { info }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "timeRequests"
                                         )
                            );
      } else if ( state.unameFullRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.uname_full = payload.data;
        return Object.assign( {}, state, { info }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "unameFullRequests"
                                         )
                            );
      } else if ( state.versionRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.version = payload.data;
        return Object.assign( {}, state, { info }
                            , resolveUUID( payload.UUID
                                         , state
                                         , "versionRequests"
                                         )
                            )
      } else {
        return state;
      }

    // TASKS
    case TYPES.TASK_CREATED:
      if ( payload.data.name === "system.general.configure" ) {
        return Object.assign( {}, state
          , recordUUID( payload.data.id, state, "generalConfigTasks" )
        );
      } else if ( payload.data.name === "system.advanced.configure" ) {
        return Object.assign( {}, state
          , recordUUID( payload.data.id, state, "advancedConfigTasks" )
        );
      } else if ( payload.data.name === "system.reboot" ) {
        return Object.assign( {}, state
          , recordUUID( payload.data.id, state, "rebootTasks" )
        );
      } else if ( payload.data.name === "system.shutdown" ) {
        return Object.assign( {}, state
          , recordUUID( payload.data.id, state, "shutdownTasks" )
        );
      }
      else {
        return state;
      }
    case TYPES.TASK_UPDATED:
      if ( payload.data.name.startsWith( "group" ) ) {
        if ( payload.data.state === "FINISHED" ) {
          if ( payload.data.name === "system.general.configure" ) {
            return Object.assign( {}, state
              , resolveUUID( payload.data.id, state, "generalConfigTasks" )
            );
          } else if ( payload.data.name === "system.advanced.configure" ) {
            return Object.assign( {}, state
              , resolveUUID( payload.data.id, state, "advancedConfigTasks" )
            );
          } else if ( payload.data.name === "system.reboot" ) {
            return Object.assign( {}, state
              , resolveUUID( payload.data.id, state, "rebootTasks" )
            );
          } else if ( payload.data.name === "system.shutdown" ) {
            return Object.assign( {}, state
              , resolveUUID( payload.data.id, state, "shutdownTasks" )
            );
          } else {
            return state;
          }
        } else {
          if ( payload.data.name === "system.general.configure" ) {
            return Object.assign( {}, state
              , recordUUID( payload.data.id, state, "generalConfigTasks" )
            );
          } else if ( payload.data.name === "system.advanced.configure" ) {
            return Object.assign( {}, state
              , recordUUID( payload.data.id, state, "advancedConfigTasks" )
            );
          } else if ( payload.data.name === "system.reboot" ) {
            return Object.assign( {}, state
              , recordUUID( payload.data.id, state, "rebootTasks" )
            );
          } else if ( payload.data.name === "system.shutdown" ) {
            return Object.assign( {}, state
              , recordUUID( payload.data.id, state, "shutdownTasks" )
            );
          } else {
            return state;
          }
        }
      } else {
        return state;
      }


    default:
      return state;
  }
};
