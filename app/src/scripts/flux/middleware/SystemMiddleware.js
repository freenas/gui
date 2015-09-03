// System Info Data Middleware
// ===================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";
import SAC from "../actions/SystemActionCreators";

class SystemMiddleware extends AbstractBase {

  static subscribe ( componentID ) {
    MC.subscribe( [ "task.*", "system.*" ]
                , componentID
                );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "task.*", "system.*" ]
                  , componentID
                  );
  }

  static requestSystemInfo ( namespace ) {
    MC.request( "system.info." + namespace
              , []
              , SAC.receiveSystemInfo.bind( SAC, namespace )
              );
  }

  static requestSystemDevice ( arg ) {
    MC.request( "system.device.get_devices"
              , [ arg ]
              , SAC.receiveSystemDevice.bind( SAC, arg )
              );
  }

  static requestSystemGeneralConfig () {
    MC.request( "system.general.get_config"
              , []
              , SAC.receiveSystemGeneralConfig );
  }

  static updateSystemGeneralConfig ( settings ) {
    MC.request( "task.submit"
              , [ "system.general.configure", [ settings ] ]
              , SAC.receiveSystemGeneralConfigUpdateTask
              );
  }

  static requestSystemUIConfig () {
    MC.request( "system.ui.get_config"
              , []
              , SAC.receiveSystemUIConfig );
  }

  static updateSystemUIConfig ( settings ) {
    MC.request( "task.submit"
              , [ "system.ui.configure", [ settings ] ]
              , SAC.receiveSystemUIConfigUpdateTask
              );
  }

  static requestSystemAdvancedConfig () {
    MC.request( "system.advanced.get_config"
              , []
              , SAC.receiveSystemAdvancedConfig
              );
  }

  static updateSystemAdvancedConfig ( settings ) {
    MC.request( "task.submit"
              , [ "system.advanced.configure", [ settings ] ]
              , SAC.receiveSystemAdvancedConfigUpdateTask
              );
  }

  static requestTimezones () {
    MC.request( "system.general.timezones"
              , []
              , SAC.receiveTimezones
              );
  }

  static requestKeymaps () {
    MC.request( "system.general.keymaps"
              , []
              , SAC.receiveKeymaps
              );
  }
};

export default SystemMiddleware;
