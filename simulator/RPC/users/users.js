// Users RPC Class
// ===================
// Provides RPC functions for the users namespace.

"use strict";


class Users {

  static query ( system ) {
    return system[ "users" ];
  }

}


export default Users;
