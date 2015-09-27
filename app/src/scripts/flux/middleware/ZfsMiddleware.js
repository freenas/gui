// ZFS Pool Middleware
// ===================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import MiddlewareAbstract from "./MIDDLEWARE_BASE_CLASS";
import ZAC from "../actions/ZfsActionCreators";

class ZfsMiddleware extends MiddlewareAbstract {

  static subscribe ( componentID ) {
    MC.subscribe( [ "entity-subscriber.volumes.changed", "task.progress" ]
                , componentID
                );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "entity-subscriber.volumes.changed", "task.progress" ]
                  , componentID
                  );
  }

  static requestVolumes () {
    MC.request( "volumes.query"
              , []
              , ZAC.receiveVolumes
              );
  }

  static requestAvailableDisks () {
    MC.request( "volumes.get_available_disks"
              , []
              , ZAC.receiveAvailableDisks
              );
  }

  static submitVolume ( volumeProps ) {
    MC.request( "task.submit"
              , [ "volume.create", [ volumeProps ] ]
              , ZAC.receiveVolumes
              );
  }

  static destroyVolume ( volumeName ) {
    MC.request( "task.submit"
              , [ "volume.destroy", [ volumeName ] ]
              , ZAC.receiveVolumes
              );
  }

};

export default ZfsMiddleware;
