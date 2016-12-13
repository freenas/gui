import { AbstractDao } from './abstract-dao-ng';

export class VolumeSnapshotDao extends AbstractDao {

    public constructor() {
        super('VolumeSnapshot', {
            eventName: 'entity-subscriber.volume.snapshot.changed'
        });
    }

}

