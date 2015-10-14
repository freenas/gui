// SHARES MIDDLEWARE
// =================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";

import SAC from "../actions/SharesActionCreators";

export default class SharesMiddleware extends AbstractBase {

  // SUBSCRIPTION MANAGEMENT
  static subscribe ( componentID ) {
    MC.subscribe( [ "shares.changed" ], componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "shares.changed" ], componentID );
  }


  // QUERY
  static query () {
    MC.request( "shares.query", [], SAC.receiveShares );
  }


  // MODIFICATION TASKS
  static create ( share ) {
    MC.submitTask( [ "share.create", [ share ] ]
                 , SAC.receiveShareCreateTask
                 );
  }

  static update ( name ) {
    MC.submitTask( [ "share.update", [ name ] ]
                 , SAC.receiveShareUpdateTask
                 );
  }

  static delete ( name ) {
    MC.submitTask( [ "share.delete", [ name ] ]
                 , SAC.receiveShareDeleteTask
                 );
  }

};
