// Simulator RPC Class
// ===================
// Provides tasks that directly manipulate the simulation middleware

"use strict";

import _ from "lodash";

import RPCBase from "../RPC_BASE_CLASS";

class Simulate extends RPCBase {
  constructor () {
    super();

    this.smart = new Smart();
    this.namespace = "simulate";
    this.CHANGE_EVENT = [ "disks.update" ];

    this.addChangeListener = function( callback ) {
      _.forEach( this.CHANGE_EVENT
               , function registerListener ( event ) {
                 this.on( event, callback );
               }
               , this
               );
    }
  }

}

class Smart extends RPCBase {
  constructor () {
    super();

    this.namespace = "smart";
  }

  set_disk_temp ( system, args, callback ) {
    var diskPath = args[0];
    var temp = args[1];

    var diskIndex =
      _.findIndex( system[ "disks" ]
                 , { path: diskPath }
                 );

    system[ "disks" ][ diskIndex ][ "smart-statistics" ][ "Temperature_Celcius" ] = temp;

    callback( system, system[ "disks"][ diskIndex ] );

    this.emitChange( "disks.update"
                   , system[ "disks" ][ diskIndex ]
                   );

  }

  set_disk_status ( system, args, callback ) {
    var diskPath = args[0];
    var status = args[1];

    var diskIndex =
      _.findIndex( system[ "disks" ]
                 , { path: diskPath }
                 );

    system[ "disks" ][ diskIndex ][ "smart-status" ] = status;

    callback( system, system[ "disks" ][ diskIndex ] );

    this.emitChange( "disks.update"
                   , system[ "disks" ][ diskIndex ]
                   );

  }

}

export default Simulate
