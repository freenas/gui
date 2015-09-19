// Update Middleware
// =================
// Provides utility function to obtain update information and perform updates.

"use strict";

import MC from "../../websocket/MiddlewareClient";
import MiddlewareBase from "./MIDDLEWARE_BASE_CLASS";

import UAC from "../actions/UpdateActionCreators";

class UpdateMiddleware extends MiddlewareBase {
  static subscribe ( componentID ) {
    MC.subscribe( [ "update.*", "task.progress" ], componentID );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "update.*", "task.progress" ], componentID );
  }

  // requests general update config
  static getUpdateConfig () {
    MC.request( "update.get_config"
              , []
              , UAC.receiveUpdateConfig
              );
  }

  static getCurrentTrain () {
    MC.request( "update.get_current_train"
              , []
              , UAC.receiveCurrentTrain
              );
  }

  // requests information for an available update
  static getUpdateInfo () {
    MC.request( "update.update_info"
              , []
              , UAC.receiveUpdateInfo
              );
  }

  static isUpdateAvailable () {
    MC.request( "update.is_update_available"
              , []
              , UAC.receiveUpdateAvailable
              );
  }

  static getUpdateTrains () {
    MC.request( "update.trains"
              , []
              , UAC.receiveUpdateTrains
              );
  }

  static updateNow () {
    MC.request( "task.submit"
              , [ "update.update", [] ]
              , UAC.receiveUpdateNowTask
              );
  }

  static downloadUpdate () {
    MC.request( "task.submit"
              , [ "update.download", [] ]
              , UAC.receiveDownloadUpdateTask
              );
  }

  static updateManually ( path, hash ) {
    MC.request( "task.submit"
              , [ "update.manual", [ path, hash ] ]
              , UAC.receiveManualUpdateTask
              );
  }

  // What is the response from this?
  static verifyInstall () {
    MC.request( "task.submit"
              , [ "update.verify", [] ]
              , UAC.receiveVerifyInstallTask
              );
  }

  static configureUpdates ( config ) {
    MC.request( "task.submit"
              , [ "update.configure", config ]
              , UAC.receiveConfigureUpdateTask
              );
  }
};

export default UpdateMiddleware;
