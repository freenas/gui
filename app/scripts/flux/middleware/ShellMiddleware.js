// Shell Middleware
// ================
// Utility methods for accessing shells through the Middleware Server.

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";
import SAC from "../actions/ShellActionCreators";

export default class ShellMiddleware extends AbstractBase {

  static requestAvailableShells ( callback ) {
    MC.request( "shell.get_shells", null, SAC.receiveShells );
  }

  static spawnShell ( shellType, callback ) {
    MC.request( "shell.spawn", [ shellType ], callback );
  }

};
