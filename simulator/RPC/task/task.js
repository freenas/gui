// Tasks RPC Class
// ===============
// Handles task calls for the simulation middleware. Actual tasks are handled
// in their respective namespace classes.

"use strict";

import { EventEmitter } from "events";
import _ from "lodash";

import RPCBase from "../RPC_BASE_CLASS";

class Tasks extends RPCBase {
  constructor () {
    super();

    this.rpcClasses = [];
    this.namespace = "task";
    // TODO: Figure out events for tasks

  }

  query ( system, filter, params ) {

  }

  // Submit the active RPCClasses. This will include itself!
  designateRPCClasses( rpcClasses ) {
    this.rpcClasses = rpcClasses;
  }

  submit ( system, args ) {

    var taskCall;
    var taskNamespace;
    var secondTaskNamespace;
    var taskNamespaceClass;
    var taskMethod;
    var taskFunction;
    var response;

    taskCall = args[0].split( "." );

    taskNamespace = taskCall.shift();

    // This is a filthy thing to do, but it's better than changing things in
    // the GUI that will break when we reunite with the new middleware.
    // Basically, most task and RPC namespaces match, but for zfs volumes, the
    // RPC namespace is "volumes" and the task namespace is "volume"... for only
    // some tasks. Maybe because those calls apply only to one volume at a time?
    if ( taskNamespace === "volume" ) {
      taskNamespace = "volumes";
    }

    if ( taskCall.length > 1 ) {
      secondTaskNamespace = taskCall.shift();
    }

    taskMethod = taskCall[0];

    if ( _.has( this.rpcClasses, taskNamespace ) ) {
      if ( secondTaskNamespace ) {
        // Someone help me get to these functions, with the right binding, with less madness than this.
        taskFunction = this.rpcClasses[ taskNamespace ][ secondTaskNamespace ][ taskMethod ].bind( this.rpcClasses[ taskNamespace ] );
      } else {
        taskFunction = this.rpcClasses[ taskNamespace ][ taskMethod ].bind( this.rpcClasses[ taskNamespace ] );
      }

      taskFunction( system
                  , args[1]
                  , function responseCallback ( changedSystem
                                              , taskResponse
                                              ) {
                    system = changedSystem;
                    response = taskResponse;
                  }
                  );

    }

    if ( !response ) {
      console.warn( "Task " + args[0] + " failed or is not implemented." );
    }
    return response;

  }

}


export default Tasks;
