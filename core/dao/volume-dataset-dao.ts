import { AbstractDao } from './abstract-dao-ng';

export class VolumeDatasetDao extends AbstractDao {

    public constructor() {
        super('VolumeDataset', {
            eventName: 'entity-subscriber.volume.dataset.changed'
        });
    }

}
