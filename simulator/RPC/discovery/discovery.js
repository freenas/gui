// Discovery RPC Class
// ===================
// Provides RPC functions for the discovery namespace.

"use strict";

import RPCBase from "../RPC_BASE_CLASS";

import schema from "./schema.json";
import services from "./services.json";
import methods from "./methods.json";

class Discovery extends RPCBase {

  constructor () {
    super();
    this.namespace = "discovery";
  }

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
