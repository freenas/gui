// ZFS Pool Middleware
// ===================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import MiddlewareAbstract from "./MIDDLEWARE_BASE_CLASS";
import ZAC from "../actions/ZfsActionCreators";

class ZfsMiddleware extends MiddlewareAbstract {

  static subscribe ( componentID ) {
    MC.subscribe( [ "entity-subscriber.volumes.changed" ]
                , componentID
                );
  }

  static unsubscribe ( componentID ) {
    MC.unsubscribe( [ "entity-subscriber.volumes.changed" ]
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

  // TODO: Deprecated, should be using volumes.* RPC namespaces now
  static requestPool ( poolName ) {
    MC.request( "zfs.pool." + poolName
              , []
              , ZAC.receivePool
              );
  }

  static requestBootPool () {
    MC.request( "zfs.pool.get_boot_pool"
              , []
              , ZAC.receiveBootPool
              );
  }

  static requestPoolDisks ( poolName ) {
    MC.request( "zfs.pool.get_disks"
              , [ poolName ]
              , ZAC.receivePoolDisks.bind( ZAC, poolName )
              );
  }

  static submitVolume ( volumeProps ) {
    MC.request( "task.submit"
              , [ "volumes.create", [ volumeProps ] ]
              , ZAC.receiveVolumes
              );
  }

  static destroyVolume ( volumeName ) {
    MC.request( "task.submit"
              , [ "volumes.destroy", [ volumeName ] ]
              , ZAC.receiveVolumes
              );
  }

};

export default ZfsMiddleware;
