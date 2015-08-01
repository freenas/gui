// Discovery RPC Class
// ===================
// Provides RPC functions for the discovery namespace.

"use strict";

import schema from "./schema.json";
import services from "./services.json";
import methods from "./methods.json";

class Discovery {

  get_methods ( system, service ) {
    return methods[ service ];
  }

  get_schema () {
    return schema;
  }

  get_services () {
    return services;
  }

}


export default Discovery;
