import { AbstractDao } from './abstract-dao';

export class VolumeSnapshotDao extends AbstractDao {

    public constructor() {
        super('VolumeSnapshot', {
            eventName: 'entity-subscriber.volume.snapshot.changed'
        });
    }

}

