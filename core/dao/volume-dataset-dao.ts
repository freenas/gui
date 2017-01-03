import { AbstractDao } from './abstract-dao';

export class VolumeDatasetDao extends AbstractDao {

    public constructor() {
        super('VolumeDataset', {
            eventName: 'entity-subscriber.volume.dataset.changed'
        });
    }

}
