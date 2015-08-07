// Shell RPC Class
// ===================
// Provides RPC functions for the shell namespace.

"use strict";

import RPCBase from "../RPC_BASE_CLASS";

class Shell extends RPCBase {

  constructor() {
    super();
    this.namespace = "shell";
  }

  get_shells ( system ) {
    return system[ "shells" ];
  }

  spawn () {
    return [ "Cannot spawn a shell in simulation mode." ];
  }

}


export default Shell;
