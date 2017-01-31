import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetPropertyDedup} from '../model/VolumeDatasetPropertyDedup';

export class VolumeDatasetPropertyDedupDao extends AbstractDao<VolumeDatasetPropertyDedup> {
    public constructor() {
        super(Model.VolumeDatasetPropertyDedup);
    }
}
