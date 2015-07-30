// Discovery RPC Class
// ===================
// Provides RPC functions for the discovery namespace.

"use strict";

import schema from "./schema.json";
import services from "./services.json";
import methods from "./methods.json";

class Discovery {

  static get_methods ( system, service ) {
    return methods[ service ];
  }

  static get_schema () {
    return schema;
  }

  static get_services () {
    return services;
  }

}


export default Discovery;
