// System RPC Class
// ===================
// Provides RPC functions for the system namespace.

"use strict";

import RPCBase from "../RPC_BASE_CLASS";

class System extends RPCBase {
  constructor () {
    super();

    this.info = new Info();
    this.general = new General();
    this.namespace = "system";
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

  configure () {}

}


export default System;
