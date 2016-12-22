import { AbstractDao } from './abstract-dao-ng';
import * as Promise from "bluebird";

export class DetachedVolumeDao extends AbstractDao {

    public constructor() {
        super('DetachedVolume', {
            queryMethod: 'volume.find',
            preventQueryCaching: true
        });
    }

    public list(): Promise<Array<any>> {
        return AbstractDao.prototype.list.call(this).then(function(detachedVolumes) {
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
