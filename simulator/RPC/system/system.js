// System RPC Class
// ===================
// Provides RPC functions for the system namespace.

"use strict";


class System {
  constructor () {
    this.info = new Info();
    this.general = new General();
  }
}

class Info {

  hardware ( system ) {
    return { memory_size: system[ "memory_size" ]
           , cpu_model: system[ "cpu_model" ]
           , cpu_cores: system[ "cpu_cores" ]
           };
  }
}

class General {

  get_config ( system ) {
    return { timezone: system[ "timezone" ]
           , hostname: system[ "hostname" ]
           , language: system[ "language" ]
           , console_keymap: system[ "console_keymap" ]
           };
  }

}


export default System;
