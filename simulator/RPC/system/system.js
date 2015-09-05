// System RPC Class
// ===================
// Provides RPC functions for the system namespace.

"use strict";

import _ from "lodash";

import RPCBase from "../RPC_BASE_CLASS";

class System extends RPCBase {
  constructor () {
    super();

    this.info = new Info();
    this.general = new General();
    this.ui = new UI();
    this.advanced = new Advanced();
    this.namespace = "system";

    this.CHANGE_EVENT = [ "system.general.changed"
                        , "system.ui.changed"
                        , "system.advanced.changed"
                        ];
    this.TASK_EVENT = [ "system.general"
                      , "system.ui"
                      , "system.advanced"
                      ];
  }
}

class Info extends RPCBase  {
  constructor () {
    super();

    this.namespace = "system.info";
  }

  hardware ( system ) {
    return { memory_size: system[ "memory_size" ]
           , cpu_model: system[ "cpu_model" ]
           , cpu_cores: system[ "cpu_cores" ]
           };
  }

  uname_full ( system ) {
    return { uname_full: system[ "uname_full" ] }
  }

  version ( system ) {
    return { version: system[ "version" ] }
  }
}

class General extends RPCBase {
  constructor () {
    super();

    this.namespace = "system.general";
  }

  get_config ( system ) {
    return { timezone: system[ "timezone" ]
           , hostname: system[ "hostname" ]
           , language: system[ "language" ]
           , console_keymap: system[ "console_keymap" ]
           };
  }

  timezones ( system ) {
    return system[ "timezones" ];
  }

  keymaps ( system ) {
    return system[ "keymaps" ];
  }

  configure ( system, args, callback ) {
    var newSystem = _.cloneDeep( system );
    var changedAttributes = {};
    // var timeout = 1000;
    var timeout = 0;

    if ( _.has( args[0], "timezone" ) ) {
      newSystem[ "timezone" ] = args[0][ "timezone" ];
      changedAttributes[ "timezone" ] = args[0][ "timezone" ];
    }

    if ( _.has( args[0], "hostname" ) ) {
      newSystem[ "hostname" ] = args[0][ "hostname" ];
      changedAttributes[ "hostname" ] = args[0][ "hostname" ];
    }

    if ( _.has( args[0], "language" ) ) {
      newSystem[ "language" ] = args[0][ "language" ];
      changedAttributes[ "language" ] = args[0][ "language" ];
    }

    if ( _.has( args[0], "console_keymap" ) ) {
      newSystem[ "console_keymap" ] = args[0][ "console_keymap" ];
      changedAttributes[ "console_keymap" ] = args[0][ "console_keymap" ];
    }

    callback( newSystem, changedAttributes );
    this.emitChange( "system.general.changed"
                   , "system.general.configure"
                   , _.cloneDeep( newSystem )
                   , timeout
                   );
    this.emitTask( this.namespace
                 , "system.general.configure"
                 , timeout
                 , "root"
                 , args[0]
                 , _.cloneDeep( newSystem[ "uiSettings" ] )
                 , true // task succeeds
                 );
  }
}

class UI extends RPCBase {
  constructor () {
    super();

    this.namespace = "system.ui";
  }

  get_config ( system ) {
    return system[ "uiSettings" ];
  }

  configure ( system, args, callback ) {
    var newSystem = _.cloneDeep( system );
    const timeout = 1500;

    newSystem[ "uiSettings" ] =
      _.merge( _.cloneDeep( newSystem[ "uiSettings" ] )
             , args[0]
             );

    callback( newSystem, newSystem[ "uiSettings" ] );
    this.emitChange( "system.ui.changed"
                   , "system.ui.configure"
                   , _.cloneDeep( newSystem[ "uiSettings" ] )
                   , timeout
                   );
    this.emitTask( this.namespace
                 , "system.ui.configure"
                 , timeout
                 , "www"
                 , args[0]
                 , _.cloneDeep( newSystem[ "uiSettings" ] )
                 , true
                 );
    // TODO: Error detection and handling
  }
}

class Advanced extends RPCBase {
  constructor () {
    super();

    this.namespace = "system.advanced";
  }

  get_config ( system ) {
    return system[ "advancedSettings" ];
  }

  configure ( system, args, callback ) {
    var newSystem = _.cloneDeep( system );
    const timeout = 1000;

    newSystem[ "advancedSettings" ] =
      _.merge( _.cloneDeep( newSystem[ "advancedSettings" ] )
             , args[0]
             );

    callback( newSystem, newSystem[ "advancedSettings" ] );
    this.emitChange( "system.advanced.changed"
                   , "system.advanced.configure"
                   , _.cloneDeep( newSystem[ "advancedSettings" ] )
                   , timeout
                   );
    this.emitTask( this.namespace
                 , "system.advanced.configure"
                 , timeout
                 , "root"
                 , args[0]
                 , _.cloneDeep( newSystem[ "advancedSettings" ] )
                 , true
                 );
    // TODO: Error detection and handling
  }
}


export default System;
