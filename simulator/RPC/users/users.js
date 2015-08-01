// Users RPC Class
// ===================
// Provides RPC functions for the users namespace.

"use strict";

import { EventEmitter } from "events";

class Users extends EventEmitter {

  constructor () {
    super();
  }

  query ( system ) {
    return system[ "users" ];
  }

  create ( system, args ) {
    console.log( "users.create is not yet implemented." );
    return system[ "users" ];
  }

  delete ( system, args ) {
    console.log( "users.delete is not yet implemented." );
    return system[ "users" ];
  }

  update ( system, args ) {
    console.log( "users.update is not yet implemented." );
    return system[ "users" ];
  }

}


export default Users;
