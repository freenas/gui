// ZFS Pool Middleware
// ===================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import MiddlewareAbstract from "./MIDDLEWARE_BASE_CLASS";
import ZAC from "../actions/ZfsActionCreators";

export default class ZfsMiddleware extends MiddlewareAbstract {

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


  // VOLUME TASKS
  static submitVolume ( volumeProps ) {
    MC.submitTask( [ "volume.create", [ volumeProps ] ]
                 , ZAC.receiveVolumeCreateTask
                 );
  }

  static updateVolume ( volumeProps ) {
    MC.submitTask( [ "volume.create", [ volumeProps ] ]
                 , ZAC.receiveVolumeUpdateTask
                 );
  }

  static destroyVolume ( volumeName ) {
    MC.submitTask( [ "volume.destroy", [ volumeName ] ]
                 , ZAC.receiveVolumeDestroyTask
                 );
  }

  // DATASET TASKS
  static createDataset ( pool_name, path, type, params ) {
    MC.submitTask( [ "volume.dataset.create", Array.from( arguments ) ] );
  }

  static updateDataset ( pool_name, path, updated_params ) {
    MC.submitTask( [ "volume.dataset.update", Array.from( arguments ) ] );
  }

  static deleteDataset ( pool_name, path ) {
    MC.submitTask( [ "volume.dataset.delete", Array.from( arguments ) ] );
  }

};
