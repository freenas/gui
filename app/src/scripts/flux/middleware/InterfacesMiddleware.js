// Interfaces Middleware
// =====================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";

import IAC from "..//actions/InterfacesActionCreators";

class InterfacesMiddleware extends AbstractBase {

  static subscribe ( componentID ) {
    MC.subscribe( [ "entity-subscriber.network.interfaces.changed" ], componentID );
    MC.subscribe( [ "task.*" ], componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "entity-subscriber.network.interfaces.changed" ], componentID );
    MC.unsubscribe( [ "task.*" ], componentID );
  }

  static requestInterfacesList () {
      MC.request( "network.interfaces.query"
                , []
                , IAC.receiveInterfacesList
                );
    }

  static configureInterface ( interfaceName, props ) {
    MC.request( "task.submit"
              , [ "network.interface.configure", [ interfaceName, props ] ]
              , IAC.receiveInterfaceConfigureTask.bind( IAC, interfaceName )
              );
  }

  static upInterface ( interfaceName ) {
    MC.request( "task.submit"
              , [ "network.interface.up", [ interfaceName ] ]
              , IAC.receiveUpInterfaceTask.bind( IAC, interfaceName )
              );
  }

  static downInterface ( interfaceName ) {
    MC.request( "task.submit"
              , [ "network.interface.down", [ interfaceName ] ]
              , IAC.receiveDownInterfaceTask.bind( IAC, interfaceName )
              );
  }

};

export default InterfacesMiddleware;
