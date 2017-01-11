import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VolumeSnapshotDao extends AbstractDao {

    public constructor() {
        super(Model.VolumeSnapshot, {
            eventName: 'entity-subscriber.volume.snapshot.changed'
        });
    }

}

