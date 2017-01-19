import { AbstractDao } from './abstract-dao';
import * as Promise from "bluebird";
import {Model} from "../model";

export class DetachedVolumeDao extends AbstractDao {

    public constructor() {
        super(Model.DetachedVolume, {
            queryMethod: 'volume.find',
            preventQueryCaching: true
        });
    }

    public list(): Promise<Array<any>> {
        return this.query().then(function(detachedVolumes) {
            for (let detachedVolume of detachedVolumes) {
                detachedVolume._isDetached = true;
            }
            return detachedVolumes;
        });
    }

    public import(volume: any) {
        return this.middlewareClient.submitTask('volume.import', [volume.id, volume.name]);
    }

    public delete(volume: any) {
        return this.middlewareClient.submitTask('volume.delete_exported', [volume.name]);
    }
}
