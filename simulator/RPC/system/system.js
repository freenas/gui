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
  }
}

class Info extends RPCBase  {
  constructor () {
    super();

  }

  hardware ( system ) {
    return { memory_size: system[ "memory_size" ]
           , cpu_model: system[ "cpu_model" ]
           , cpu_cores: system[ "cpu_cores" ]
           };
  }
}

class General extends RPCBase {
  constructor () {
    super();

  }

  get_config ( system ) {
    return { timezone: system[ "timezone" ]
           , hostname: system[ "hostname" ]
           , language: system[ "language" ]
           , console_keymap: system[ "console_keymap" ]
           };
  }

}


export default System;
