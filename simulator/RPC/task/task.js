// Tasks RPC Class
// ===============
// Handles task calls for the simulation middleware. Actual tasks are  handled
// in their respective namespace classes.

class Tasks {

  static query ( system, filter, params ) {
    return [ "tasks.query is not yet implemented." ];
  }

  static submit ( system, args ) {

    var taskCall;
    var taskNamespace;
    var secondTaskNamespace;
    var taskNamespaceClass;
    var taskMethod;
    var responseContent;
    var response;

    taskCall = args[0].split( "." );

    taskNamespace = taskCall.shift();

    if ( taskCall.length > 1 ) {
      secondTaskNamespace = taskCall.shift;
    }

    taskNamespaceClass = require( "../" + taskNamespace + "/" + taskNamespace );

    taskMethod = taskCall[0];

    if ( taskNamespaceClass ) {
      if ( secondTaskNamespace ) {
        responseContent =
          taskNamespaceClass[ secondTaskNamespace ][ taskMethod ]( system
                                                                 , args[1] );
      } else {
        responseContent = taskNamespaceClass[ taskMethod ]( system, args[0] );
      }
    }

    if ( !responseContent ) {
      responseContent =
        [ "Task " + args[0] + " failed or is not implemented." ];
    }

    return responseContent;

  }
}


export default Tasks;
