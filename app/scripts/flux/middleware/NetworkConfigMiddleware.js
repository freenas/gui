// Network Config Middleware
// =========================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";

import NCAC
  from "../actions/NetworkConfigActionCreators";

class NetworkConfigMiddleware {

  static subscribe ( componentID ) {
    MC.subscribe( [ "network.changed" ], componentID );
    MC.subscribe( [ "task.progress" ], componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "network.changed" ], componentID );
    MC.unsubscribe( [ "task.progress" ], componentID );
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
