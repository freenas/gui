import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {DetachedVolume} from '../model/DetachedVolume';

export class DetachedVolumeDao extends AbstractDao<DetachedVolume> {

    public constructor() {
        super(Model.DetachedVolume, {
            queryMethod: 'volume.find',
            preventQueryCaching: true
        });
    }

    public list(): Promise<Array<DetachedVolume>> {
        return this.query().then(function(detachedVolumes) {
            for (let detachedVolume of detachedVolumes) {
                detachedVolume._isDetached = true;
            }
            return detachedVolumes;
        });
    }

    public import(volume: DetachedVolume) {
        return this.middlewareClient.submitTask('volume.import', [volume.id, volume.name]);
    }

    public delete(volume: DetachedVolume) {
        return this.middlewareClient.submitTask('volume.delete_exported', [volume.name]);
    }
}
