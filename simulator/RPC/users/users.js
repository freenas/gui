// Users RPC Class
// ===================
// Provides RPC functions for the users namespace.

"use strict";


class Users {

  static query ( system ) {
    return system[ "users" ];
  }

  static create ( system, args ) {
    console.log( "users.create is not yet implemented." );
    return system[ "users" ];
  }

  static delete ( system, args ) {
    console.log( "users.delete is not yet implemented." );
    return system[ "users" ];
  }

  static update ( system, args ) {
    console.log( "users.update is not yet implemented." );
    return system[ "users" ];
  }

}


export default Users;
