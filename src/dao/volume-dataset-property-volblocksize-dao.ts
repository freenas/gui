import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {VolumeDatasetPropertyVolblocksize} from '../model/VolumeDatasetPropertyVolblocksize';

export class VolumeDatasetPropertyVolblocksizeDao extends AbstractDao<VolumeDatasetPropertyVolblocksize> {
    public constructor() {
        super(Model.VolumeDatasetPropertyVolblocksize);
    }
}
