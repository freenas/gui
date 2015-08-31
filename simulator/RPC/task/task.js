// Tasks RPC Class
// ===============
// Handles task calls for the simulation middleware. Actual tasks are handled
// in their respective namespace classes.

"use strict";

import _ from "lodash";
import moment from "moment";

import RPCBase from "../RPC_BASE_CLASS";

class Tasks extends RPCBase {
  constructor ( system ) {
    super();

    this.system = system;

    this.rpcClasses = [];
    this.namespace = "task";
    // TODO: Figure out events for tasks

  }

  query ( system, filter, params ) {

  }

  // Submit the active RPCClasses. This will include itself! It will then also
  // subscribe to their task events.
  designateRPCClasses( rpcClasses ) {
    this.rpcClasses = rpcClasses;

    // Register event listeners for all active namespaces
    _.forEach( this.rpcClasses
             , function addTaskListenersToRPCClasses ( rpcClass ) {
               try {
                 rpcClass.addTaskListener( this.sendTaskEvents.bind( this ) );
               } catch ( err ) {
                 console.warn( err.message );
               }
             }
             , this
    );

    this.setMaxListeners( 0 );
  }

  // Some of this is only meant to be used with task logging, which is not yet implemented
  sendTaskEvents ( originMethod, timeout, owner, orginalArgs, content, succeeded ) {
    const time = moment().unix();

    const taskEventName = "task.progress";

    var creationMessage =
      { args:
        { state: "CREATED"
        , percentage: 0
        , name: originMethod
        , timestamp: time
        }
      , name: taskEventName
      };

    var waitingMessage =
      { args:
        { state: "WAITING"
        , percentage: 33
        , name: originMethod
        , timestamp: Math.floor( time + timeout / 3 )
        }
      , name: taskEventName
      };

    var executingMessage =
      { args:
        { state: "EXECUTING"
        , percentage: 67
        , name: originMethod
        , timestamp: Math.floor( time + ( 2 * timeout / 3 ) )
        }
      , name: taskEventName
      };

    var finishedMessage =
      { args:
        { state: "FINISHED"
        , percentage: 100
        , name: originMethod
        , timestamp: Math.floor( time + timeout )
        }
      , name: taskEventName
      };

    this.emit( this.namespace, creationMessage );

    setTimeout( this.emit.bind( this )
              , Math.floor( timeout / 3 )
              , this.namespace
              , waitingMessage
              );

    setTimeout( this.emit.bind( this )
              , Math.floor( 2 * timeout / 3 )
              , this.namespace
              , executingMessage
              );

    setTimeout( this.emit.bind( this )
              , timeout
              , this.namespace
              , finishedMessage
              );
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

    if ( taskCall.length > 1 ) {
      secondTaskNamespace = taskCall.shift();
    }

    // This is a filthy thing to do, but it's better than changing things in
    // the GUI that will break when we reunite with the new middleware.
    // Basically, most task and RPC namespaces match, but for zfs volumes, the
    // RPC namespace is "volumes" and the task namespace is "volume"... for only
    // some tasks. Maybe because those calls apply only to one volume at a time?
    // network.interface[s] has the same issue.
    //
    // TODO: This issue is being fixed in the new middleware. Once it's fixed
    // and we're back to testing against builds with the new middleware change
    // all simulation middleware namespaces to match and get rid of this.
    if ( taskNamespace === "volume" ) {
      taskNamespace = "volumes";
    }

    if ( secondTaskNamespace === "interface" ) {
      secondTaskNamespace = "interfaces";
    }

    taskMethod = taskCall[0];

    if ( _.has( this.rpcClasses, taskNamespace ) ) {
      if ( secondTaskNamespace && taskMethod ) {
        // Someone help me get to these functions, with the right binding, with less madness than this.
        taskFunction = this.rpcClasses[ taskNamespace ][ secondTaskNamespace ][ taskMethod ].bind( this.rpcClasses[ taskNamespace ] );
      } else if ( taskMethod ) {
        taskFunction = this.rpcClasses[ taskNamespace ][ taskMethod ].bind( this.rpcClasses[ taskNamespace ] );
      } else {
        taskFunction = function noTask () { console.log( "Couldn't Find Task", this.rpcClasses[ taskNamespace ] ); }.bind( this );
      }

      taskFunction( _.cloneDeep( this.system )
                  , args[1]
                  , function responseCallback ( changedSystem
                                              , taskResponse
                                              ) {
                    _.assign( this.system, changedSystem );
                    response = taskResponse;
                  }.bind( this )
                  );

    }

    if ( !response ) {
      console.warn( "Task " + args[0] + " failed or is not implemented." );
    }
    return response;

  }

  addTaskBroadcastListener ( callback ) {
    this.on( this.namespace, callback );
  }

  removeTaskBroadcastListener ( callback ) {
    this.removeListener( this.namespace, callback );
  }

}


export default Tasks;
