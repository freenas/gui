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
    this.namespace = "system";

    this.CHANGE_EVENT = [ "system.general.changed" ];
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

  configure ( system, args, callback ) {
    var newSystem = _.cloneDeep( system );
    var changedAttributes = {};

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
                   );

  }

}


export default System;
