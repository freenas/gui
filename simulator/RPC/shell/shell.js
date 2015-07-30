// Shell RPC Class
// ===================
// Provides RPC functions for the shell namespace.

"use strict";

const shells =
  [ "/bin/sh"
  , "/bin/csh"
  , "/usr/local/bin/zsh"
  , "/usr/local/bin/bash"
  , "/usr/local/bin/cli"
  ];

class Shell {

  static get_shells () {
    return shells;
  }

  static spawn () {
    return [ "Cannot spawn a shell in simulation mode." ];
  }

}


export default Shell;
