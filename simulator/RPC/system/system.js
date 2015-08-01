// System RPC Class
// ===================
// Provides RPC functions for the system namespace.

"use strict";


class System {
  constructor () {
    this.info = new Info();
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


export default System;
