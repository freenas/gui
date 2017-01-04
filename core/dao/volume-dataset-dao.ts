import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VolumeDatasetDao extends AbstractDao {

    public constructor() {
        super(Model.VolumeDataset, {
            eventName: 'entity-subscriber.volume.dataset.changed'
        });
    }

}
