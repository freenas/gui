import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {VolumeSnapshot} from '../model/VolumeSnapshot';

export class VolumeSnapshotDao extends AbstractDao<VolumeSnapshot> {

    public constructor() {
        super(Model.VolumeSnapshot, {
            eventName: 'entity-subscriber.volume.snapshot.changed'
        });
    }

}

