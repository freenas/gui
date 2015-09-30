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
    console.log( "query" );
    MC.request( "shares.query", [], SAC.receiveShares );
  }


  // MODIFICATION TASKS
  // static create () {
  //   MC.request( "task.submit"
  //             , [ "shares.create" ]
  //             , SAC.receiveShareCreateTask
  //             );
  // }

  // static update () {
  //   MC.request( "task.submit"
  //             , [ "shares.update" ]
  //             , SAC.receiveShareUpdateTask
  //             );
  // }

  // static delete () {
  //   MC.request( "task.submit"
  //             , [ "shares.delete" ]
  //             , SAC.receiveShareDeleteTask
  //             );
  // }

};
