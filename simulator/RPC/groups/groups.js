// Groups RPC Class
// ===================
// Provides RPC functions for the groups namespace.

"use strict";

import RPCBase from "../RPC_BASE_CLASS";

class Groups extends RPCBase {

  constructor () {
    super();
  }

  query ( system ) {
    return system[ "groups" ];
  }

  create ( system, args ) {
    console.log( "groups.create is not yet implemented." );
    return system[ "groups" ];
  }

  delete ( system, args ) {
    console.log( "groups.delete is not yet implemented." );
    return system[ "groups" ];
  }

  update ( system, args ) {
    console.log( "groups.update is not yet implemented." );
    return system[ "groups" ];
  }

}


export default Groups;
