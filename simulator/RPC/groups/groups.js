// Groups RPC Class
// ===================
// Provides RPC functions for the groups namespace.

"use strict";

import { EventEmitter } from "events";

class Groups extends EventEmitter {

  constructor () {
    super();
  }

  static query ( system ) {
    return system[ "groups" ];
  }

  static create ( system, args ) {
    console.log( "groups.create is not yet implemented." );
    return system[ "groups" ];
  }

  static delete ( system, args ) {
    console.log( "groups.delete is not yet implemented." );
    return system[ "groups" ];
  }

  static update ( system, args ) {
    console.log( "groups.update is not yet implemented." );
    return system[ "groups" ];
  }

}


export default Groups;
