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
  , ui: {}
  , info: {}
  // , connectionForm: {}
  , osForm: {}
  , localizationForm: {}
  , consoleForm: {}
  };

export default function system ( state = INITIAL_STATE, action ) {
  const { payload, error, type } = action;

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

    default:
      return state;
  }
};
