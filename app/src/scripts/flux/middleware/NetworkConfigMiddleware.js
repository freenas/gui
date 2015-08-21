// Network Config Middleware
// =========================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";

import NCAC
  from "../actions/NetworkConfigActionCreators";

class NetworkConfigMiddleware {

  static subscribe ( componentID ) {
    MC.subscribe( [ "network.updated" ], componentID );
    MC.subscribe( [ "task.*" ], componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "network.updated" ], componentID );
    MC.unsubscribe( [ "task.*" ], componentID );
  }

  static requestNetworkConfig () {
    MC.request( "network.config.get_global_config"
              , []
              , NCAC.receiveNetworkConfig
              );
  }

  static updateNetworkConfig ( settings ) {
    MC.request( "task.submit"
              , [ "network.configure", [ settings ] ]
              , NCAC.receiveNetworkUpdateTask
              );
  }

};

export default NetworkConfigMiddleware;
