// SYSTEM REDUCER
// ================

"use strict";

import * as TYPES from "../actions/actionTypes";

const INITIAL_STATE =
  { general: { timezone: ""
             , hostname: ""
             , syslog_server: ""
             , language: ""
             , console_keymap: ""
             , keymaps: []
             , timezones: []
             }
  , advanced: { boot_scrub_internal: null
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
  , info: {}
  // , connectionForm: {}
  , osForm: {}
  , localizationForm: {}
  , consoleForm: {}
  , generalConfigWaiting: false
  , generalConfigRequests: new Set()
  , timezonesWaiting: false
  , timezonesRequests: new Set()
  , keymapsWaiting: false
  , keymapsRequests: new Set()
  , advancedConfigWaiting: false
  , advancedConfigRequests: new Set()
  , serialPortsWaiting: false
  , serialPortsRequests: new Set()
  , hardwareWaiting: false
  , hardwareRequests: new Set()
  , loadAvgWaiting: false
  , loadAvgRequests: new Set()
  , timeWaiting: false
  , timeRequests: new Set()
  , unameFullWaiting: false
  , unameFullRequests: new Set()
  , versionWaiting: false
  , versionRequests: new Set()
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
      generalConfigRequests = new Set( state.generalConfigRequests );
      generalConfigRequests.add( payload.UUID );
      return Object.assign( {}, state, { generalConfigWaiting: true
                                       , generalConfigRequests
                                       }
                          );
    case TYPES.SYSTEM_GENERAL_TIMEZONES_REQUEST:
      timezonesRequests = new Set( state.timezonesRequests );
      timezonesRequests.add( payload.UUID );
      return Object.assign( {}, state, { timezonesWaiting: true
                                       , timezonesRequests
                                       }
                          );
    case TYPES.KEYMAPS_REQUEST:
      keymapsRequests = new Set( state.keymapsRequests );
      keymapsRequests.add( payload.UUID );
      return Object.assign( {}, state, { keymapsWaiting: true
                                       , keymapsRequests
                                       }
                          );

    // ADVANCED QUERIES
    case TYPES.SYSTEM_ADVANCED_CONFIG_REQUEST:
      advancedConfigRequests = new Set( state.advancedConfigRequests );
      advancedConfigRequests.add( payload.UUID );
      return Object.assign( {}, state, { advancedConfigWaiting: true
                                       , advancedConfigRequests
                                       }
                          );
    case TYPES.SERIAL_PORTS_REQUEST:
      serialPortsRequests = new Set( state.serialPortsRequests );
      serialPortsRequests.add( payload.UUID );
      return Object.assign( {}, state, { serialPortsWaiting: true
                                       , serialPortsRequests
                                       }
                          );

    // INFO QUERIES
    case TYPES.SYSTEM_INFO_HARDWARE_REQUEST:
      hardwareRequests = new Set( state.hardwareRequests );
      hardwareRequests.add( payload.UUID );
      return Object.assign( {}, state, { hardwareWaiting: true
                                       , hardwareRequests
                                       }
                          );
    case TYPES.SYSTEM_INFO_LOAD_AVG_REQUEST:
      loadAvgRequests = new Set( state.loadAvgRequests );
      loadAvgRequests.add( payload.UUID );
      return Object.assign( {}, state, { loadAvgWaiting: true
                                       , loadAvgRequests
                                       }
                          );
    case TYPES.SYSTEM_INFO_TIME_REQUEST:
      timeRequests = new Set( state.timeRequests );
      timeRequests.add( payload.UUID );
      return Object.assign( {}, state, { timeWaiting: true
                                       , timeRequests
                                       }
                          );
    case TYPES.SYSTEM_INFO_UNAME_FULL_REQUEST:
      unameFullRequests = new Set( state.unameFullRequests );
      unameFullRequests.add( payload.UUID );
      return Object.assign( {}, state, { unameFullWaiting: true
                                       , unameFullRequests
                                       }
                          );
    case TYPES.SYSTEM_INFO_VERSION_REQUEST:
      versionRequests = new Set( state.versionRequests );
      versionRequests.add( payload.UUID );
      return Object.assign( {}, state, { versionWaiting: true
                                       , versionRequests
                                       }
                          );

    // RPC Handling
    case TYPES.RPC_TIMEOUT:
    case TYPES.RPC_FAILURE:
    case TYPES.RPC_SUCCESS:

      // Serious TODO: Is there a way to make this less repetitive?
      // GENERAL
      if ( state.generalConfigRequests.has( payload.UUID ) ) {
        general = Object.assign( {}, state.general, payload.data );
        generalConfigRequests = new Set( state.generalConfigRequests );
        generalConfigRequests.delete( payload.UUID );
        return Object.assign( {}, state, { general
                                         , generalConfigWaiting: false
                                         , generalConfigRequests
                                         }
                            );
      } else if ( state.timezonesRequests.has( payload.UUID ) ) {
        general = Object.assign( {}, state.general );
        general.timezones = payload.data;
        timezonesRequests = new Set( state.timezonesRequests );
        timezonesRequests.delete( payload.UUID );
        return Object.assign( {}, state, { general
                                         , timezonesWaiting: false
                                         , timezonesRequests
                                         }
                            );
      } else if ( state.keymapsRequests.has( payload.UUID ) ) {
        general = Object.assign( state.general );
        general.keymaps = payload.data;
        keymapsRequests = new Set( state.keymapsRequests );
        keymapsRequests.delete( payload.UUID );
        return Object.assign( {}, state, { general
                                         , keymapsWaiting: false
                                         , keymapsRequests
                                         }
                            );

      // ADVANCED
      } else if ( state.advancedConfigRequests.has( payload.UUID ) ) {
        advanced = Object.assign( {}, state.advanced, payload.data );
        advancedConfigRequests = new Set( state.advancedConfigRequests );
        advancedConfigRequests.delete( payload.UUID );
        return Object.assign( {}, state, { advanced
                                         , advancedConfigWaiting: false
                                         , advancedConfigRequests
                                         }
                            );
      } else if ( state.serialPortsRequests.has( payload.UUID ) ) {
        advanced = Object.assign( {}, state.advanced );
        advanced.serial_ports = payload.data;
        serialPortsRequests = new Set( state.serialPortsRequests );
        serialPortsRequests.delete( payload.UUID );
        return Object.assign( {}, state, { advanced
                                         , serialPortsWaiting: false
                                         , serialPortsRequests
                                         }
                            );

      // INFO
      } else if ( state.hardwareRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.hardware = payload.data;
        hardwareRequests = new Set( state.hardwareRequests );
        hardwareRequests.delete( payload.UUID );
        return Object.assign( {}, state, { info
                                         , hardwareWaiting: false
                                         , hardwareRequests
                                         }
                            );
      } else if ( state.loadAvgRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.load_avg = payload.data;
        loadAvgRequests = new Set( state.loadAvgRequests );
        loadAvgRequests.delete( payload.UUID );
        return Object.assign( {}, state, { info
                                         , loadAvgWaiting: false
                                         , loadAvgRequests
                                         }
                            );
      } else if ( state.timeRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.time = payload.data;
        timeRequests = new Set( state.timeRequests );
        timeRequests.delete( payload.UUID );
        return Object.assign( {}, state, { info
                                         , timeWaiting: false
                                         , timeRequests
                                         }
                            );
      } else if ( state.unameFullRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.uname_full = payload.data;
        unameFullRequests = new Set( state.unameFullRequests );
        unameFullRequests.delete( payload.UUID );
        return Object.assign( {}, state, { info
                                         , unameFullWaiting: false
                                         , unameFullRequests
                                         }
                            );
      } else if ( state.versionRequests.has( payload.UUID ) ) {
        info = Object.assign( {}, state.info );
        info.version = payload.data;
        versionRequests = new Set( state.versionRequests );
        versionRequests.delete( payload.UUID );
        return Object.assign( {}, state, { info
                                         , versionWaiting: false
                                         , versionRequests
                                         }
                            )
      } else {
        return state;
      }

    default:
      return state;
  }
};
