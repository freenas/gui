import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {VolumeDataset} from '../model/VolumeDataset';

export class VolumeDatasetDao extends AbstractDao<VolumeDataset> {

    public constructor() {
        super(Model.VolumeDataset, {
            eventName: 'entity-subscriber.volume.dataset.changed'
        });
    }

}
